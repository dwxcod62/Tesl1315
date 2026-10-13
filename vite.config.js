import react from '@vitejs/plugin-react'
import cesium from 'vite-plugin-cesium'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// `cesium()` is added so the Cesium runtime files (Workers, Assets,
// Widgets, ThirdParty) are copied to the dev/build output. See:
// https://www.npmjs.com/package/vite-plugin-cesium
export default defineConfig({
  plugins: [
    react(),
    cesium(),
    // Cesium 1.121 (and a few gsap-era libs) ship a number of
    // legacy CJS modules and a stale deep import
    // (`@zip.js/zip.js/lib/zip-no-worker.js`) that no longer
    // resolves in the current exports field. Vite 8 + rolldown
    // enforces exports strictly, which would otherwise fail the
    // dev pre-bundle. The shim below patches each known issue.
    {
      name: 'cesium-legacy-shims',
      enforce: 'pre',
      resolveId(source) {
        // KmlDataSource deep-imports a removed zip.js subpath.
        if (source === '@zip.js/zip.js/lib/zip-no-worker.js') {
          return '\0zip-no-worker-redirect'
        }
        // @cesium/engine lacks `"type": "module"` in its package.json,
        // so Vite 8's transform layer treats its `index.js` (which is
        // actually pure ESM) as CJS and drops all named exports. Inject
        // a virtual package.json with `type: module` so Vite serves
        // the file as ESM verbatim and the named exports survive.
        if (source === '@cesium/engine/package.json') {
          return '\0cesium-engine-pkg'
        }
        if (source === '@cesium/widgets/package.json') {
          return '\0cesium-widgets-pkg'
        }
        if (source === 'cesium/package.json') {
          return '\0cesium-pkg'
        }
        return null
      },
      load(id) {
        if (id === '\0zip-no-worker-redirect') {
          return "export * from '@zip.js/zip.js';"
        }
        if (id === '\0cesium-engine-pkg') {
          return JSON.stringify({
            name: '@cesium/engine',
            version: '11.1.0',
            type: 'module',
            main: 'index.js',
            module: 'index.js',
          })
        }
        if (id === '\0cesium-widgets-pkg') {
          return JSON.stringify({
            name: '@cesium/widgets',
            version: '9.1.0',
            type: 'module',
            main: 'index.cjs',
            module: 'index.js',
          })
        }
        if (id === '\0cesium-pkg') {
          return JSON.stringify({
            name: 'cesium',
            version: '1.121.0',
            type: 'module',
            main: 'index.cjs',
            module: 'index.js',
          })
        }
        return null
      },
      // Convert `module.exports = X` in legacy CJS dependencies
      // (Cesium's transitive deps: mersenne-twister, urijs,
      // bitmap-sdf, grapheme-splitter, rbush, autolinker,
      // topojson-client, draco3d, meshoptimizer, etc.) into
      // `export default X` so `import X from "pkg"` resolves at
      // runtime.
      //
      // SCOPE: only apply to packages listed in
      // `optimizeDeps.exclude` below. These are the Cesium deps
      // that Vite deliberately lets the browser load directly
      // from `node_modules` (the pre-bundler chokes on them), so
      // they're the only ones that need rewriting.
      //
      // CRITICAL: do NOT broaden this to `react`, `react-dom`,
      // `react-dom/client`, `scheduler`, `react/jsx-runtime`, or
      // `react/jsx-dev-runtime`. Their `index.js` is the same
      // CJS shim pattern, but they ARE pre-bundled via
      // `optimizeDeps.include` and Rolldown wraps them correctly.
      // Stripping/rewriting their CJS lines breaks tree-shaking
      // and surfaces MISSING_EXPORT errors at build time.
      //
      // CRITICAL #2: do NOT strip `module.exports = X` from the
      // source. The browser has no `module` global, so if any
      // Cesium CJS file is mistakenly loaded without this shim
      // (e.g. through a side import we don't catch), stripping
      // silently masks a real `module is not defined` error. By
      // keeping the original line and *appending* `export default
      // X` we let Vite's bundler see the default export while
      // preserving the line that was actually breaking.
      transform(code, id) {
        if (!id.includes('node_modules')) return null
        if (id.includes('node_modules/.vite')) return null
        // Only transform files inside Cesium CJS deps.
        const CESIUM_CJS_DEPS = [
          'mersenne-twister',
          'urijs',
          'autolinker',
          'bitmap-sdf',
          'draco3d',
          'meshoptimizer',
          'topojson-client',
          'rbush',
          'grapheme-splitter',
        ]
        const matched = CESIUM_CJS_DEPS.some(
          (dep) =>
            id.includes(`node_modules/${dep}/`) ||
            id.includes(`node_modules\\${dep}\\`)
        )
        if (!matched) return null
        if (!/module\.exports\s*=\s*[A-Za-z_$]/.test(code)) return null
        if (/export\s+default/.test(code)) return null
        const m = code.match(/module\.exports\s*=\s*([A-Za-z_$][\w$]*)/)
        if (m) {
          const ident = m[1]
          return code + `\nexport default ${ident}\n`
        }
        return null
      },
    },
  ],
  // Cesium's CJS deps were breaking Vite 8's pre-bundling. Excluding
  // the whole pre-bundle chain for cesium lets the browser fetch
  // each module from node_modules directly, and the shim above
  // rewrites the few CJS files that lack an ESM default export.
  optimizeDeps: {
    // Cesium's CJS deps were breaking Vite 8's pre-bundling. Excluding
    // the whole pre-bundle chain for cesium lets the browser fetch
    // each module from node_modules directly, and the shim above
    // rewrites the few CJS files that lack an ESM default export.
    exclude: [
      'cesium',
      '@cesium/engine',
      '@cesium/widgets',
      '@zip.js/zip.js',
      'mersenne-twister',
      'urijs',
      'autolinker',
      'bitmap-sdf',
      'draco3d',
      'meshoptimizer',
      'topojson-client',
      'rbush',
      'grapheme-splitter',
    ],
    // Vite 8 / Rolldown use `rolldownOptions`, not `esbuildOptions`.
    // Forcing Cesium's pure-ESM `index.js` to be treated as ESM
    // (their package.json lacks `"type": "module"`).
    rolldownOptions: {
      mainFields: ['module', 'main'],
      conditions: ['module', 'browser', 'import', 'default'],
    },
  },
  build: {
    // Cesium itself is ~3 MB unminified — the 651 kB warning is just
    // gzipped Cesium + our Unit 5 shell. Bump the limit so the build
    // stays a clean ✓.
    chunkSizeWarningLimit: 1024,
  },
})
