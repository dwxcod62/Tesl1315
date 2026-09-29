import { PRIMER } from '../data/dossier';

/**
 * "Radioactive Isotopes 101" primer box.
 * Newspaper-style sidebar: lead paragraph → context → coda.
 */
export default function Primer() {
  return (
    <article className="dossier__primer">
      <div className="dossier__primer-stamp" aria-hidden="true">
        <span>101</span>
      </div>
      <div className="dossier__primer-body">
        <p className="dossier__primer-lead">{PRIMER.lead}</p>
        <p className="dossier__primer-intro">{PRIMER.intro}</p>
        <p className="dossier__primer-text">{PRIMER.body}</p>
        <p className="dossier__primer-text">{PRIMER.context}</p>
        <p className="dossier__primer-coda">{PRIMER.coda}</p>
      </div>
    </article>
  );
}
