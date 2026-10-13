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
      // Convert `module.exports = X` in legacy node_modules CJS
      // files into `export default X` so `import X from "pkg"`
      // resolves at runtime. This covers `mersenne-twister`,
      // `urijs`, `bitmap-sdf`, `grapheme-splitter`, `rbush`, etc.
      // We match on the CJS pattern rather than a path whitelist
      // so the shim covers every legacy dep Cesium pulls in.
      transform(code, id) {
        if (!id.includes('node_modules')) return null
        if (id.includes('node_modules/.vite')) return null
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
    esbuildOptions: {
      // Force Cesium's pure-ESM `index.js` files to be treated as ESM
      // by esbuild. Their package.json lacks `"type": "module"`, so
      // without this flag esbuild bundles them as CJS and drops all
      // named exports (e.g. `buildDrawCommand`).
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
