import './styles/dossier.css';
import { ITEMS, FUTURE } from './data/dossier';
import Masthead from './components/Masthead';
import InvestigativeBanner from './components/InvestigativeBanner';
import Section from './components/Section';
import Primer from './components/Primer';
import CaseIndex from './components/CaseIndex';
import Future from './components/Future';

export default function Unit5App() {
  return (
    <div className="dossier">
      <div className="dossier__inner">
        <Masthead />
        <InvestigativeBanner />

        <Section kicker="RADIOACTIVE ISOTOPES 101" title="Unstable atoms, explained" id="primer">
          <Primer />
        </Section>

        <Section
          kicker={`THE FIVE — ${ITEMS.length} CASES`}
          title="5 Radioactive Products We Use Every Day"
          id="cases"
        >
          <CaseIndex />
        </Section>

        <Section kicker={FUTURE.kicker} title={FUTURE.title} id="future">
          <Future />
        </Section>

        <footer className="dossier__colophon">
          <span>— END OF FILE —</span>
          <span>TESL 1315 · UNIT 5</span>
        </footer>
      </div>
    </div>
  );
}
