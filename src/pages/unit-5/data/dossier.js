// Content source for the Unit 5 dossier.
// Keeps copy out of JSX so editors / translators can tweak prose.

export const META = {
  kicker: 'CASE FILE №05 — DOSSIER',
  edition: 'Office of Nuclear Energy',
  dateline: 'WASHINGTON — Investigations Desk',
  author: 'Office of Nuclear Energy',
  date: 'September 12, 2023',
  readTime: '4',
};

export const HEADLINE = {
  pre: '5 EVERYDAY ITEMS · HIDDEN ISOTOPES',
  main: 'Radioactive Products We Use Every Day',
  sub:
    'Radioisotopes have hundreds of uses and can be found in countless everyday products — including these five for starters.',
};

export const STATS = [
  { label: 'Items investigated', value: '05', note: 'common objects' },
  { label: 'Isotope — banana', value: 'K-40', note: '0.1 µSv each' },
  { label: 'Read time', value: '4 min', note: 'no lab coat req.' },
];

export const PRIMER = {
  kicker: '01 — RADIOACTIVE ISOTOPES 101',
  title: 'Unstable atoms, explained',
  intro:
    'First, let’s talk radioisotopes.',
  body:
    'These are simply unstable atoms that decay and emit excess energy (also known as radiation). They can be naturally occurring or artificial isotopes of an element.',
  context:
    'You might be familiar with medical radioisotopes, which have been used to treat an array of medical conditions since the 1940s, or perhaps you’ve heard of the radioisotope power systems that have powered more than two dozen NASA space missions.',
  lead:
    'Nuclear energy powers our lives in different ways — exploring the galaxy, diagnosing and treating diseases, solving criminal cases, and powering our grid as the largest source of clean energy in the U.S.',
  coda:
    'And while all of that is incredible, did you know there are several items found at home and in the office that we use daily that also use radioactive materials? These items do all sorts of things — from keeping you on time for your appointments to literally saving your life.',
};

export const ITEMS = [
  {
    no: '01',
    code: 'CLOCKS',
    title: 'Clocks and Timepieces',
    kicker: 'When it comes to telling time, precision counts.',
    body: ['...'],
    isotope: 'Tritium (H-3)',
    fact: null,
  },
  {
    no: '02',
    code: 'GEMSTONES',
    title: 'Gemstones',
    kicker: 'Adorn yourself with jewelry?',
    body: ['...'],
    isotope: 'γ / n / e⁻ beams',
    fact: null,
  },
  {
    no: '03',
    code: 'SMOKE DETECTORS',
    title: 'Smoke Detectors',
    kicker: 'Considered the greatest fire safety success story of the 20th century.',
    body: ['...'],
    isotope: 'Americium-241',
    fact: null,
  },
  {
    no: '04',
    code: 'EXIT SIGNS',
    title: 'Exit Signs',
    kicker: 'Required by law — and glowing without batteries.',
    body: ['...'],
    isotope: 'Tritium (H-3)',
    fact: null,
  },
  {
    no: '05',
    code: 'SNACK TIME',
    title: 'Snack Time',
    kicker: '[[term]]Bananas[[/term]] are radioactive — and so is your beer.',
    body: [
      'Reaching for a [[term]]banana[[/term]] in the supermarket produce aisle will give you more than just a healthy dose of potassium.',
      'That’s right, [[term]]bananas[[/term]] contain naturally occurring [[term]]radionuclides[[/term]] — [[term]]radioactive potassium-40[[/term]], to be exact — which, according to the EPA, means they can emit .01 millirem (0.1 microsieverts).',
      'So, eating a [[term]]banana[[/term]] actually presents more radiation exposure than if you were standing next to a spent nuclear fuel dry cask or nuclear power plant!',
      'But don’t go [[term]]bananas[[/term]]! While the fruit is indeed radioactive, the dose of radioactivity they deliver is miniscule and does not pose a health risk.',
    ],
    isotope: 'Potassium-40',
    fact:
      'If you’re attending post-work happy hour, there’s a teeny bit (about 390 Picocurie per kilogram) of the same isotope [[term]]potassium-40[[/term]] in your beer, too.',
  },
];

export const BANANA = {
  id: 'banana',
  term: 'Banana',
  tagline: 'Radioactive snack of the day.',
  img: 'BANANA',
  // Quick-scan spec sheet, dossier style.
  facts: [
    {
      label: 'Scientific Name',
      value: 'Musa spp.',
      note: 'A genus of flowering plants in the family Musaceae, comprising more than 70 species.',
    },
    {
      label: 'Classification',
      value: 'Berry',
      note: 'Botanically, the banana is classified as a berry — unlike strawberries, which are not.',
    },
    {
      label: 'Radioactive Isotope',
      value: 'Potassium-40 (K-40)',
      note: 'Makes up about 0.0117% of [[natural]]natural potassium[[/natural]] — enough to give every banana a small, measurable dose.',
    },
    {
      label: 'Radiation Dose',
      value: '0.1 µSv per fruit',
      note: 'Equivalent to roughly 0.01 millirem — negligible compared to the daily background dose of about 10 µSv.',
    },
    {
      label: 'BED Unit',
      value: 'Banana Equivalent Dose',
      note: 'An informal unit used by physicists to compare everyday radiation exposures to the radiation of a single banana.',
    },
    {
      label: 'Half-life',
      value: '1.25 billion years',
      note: 'The half-life of K-40 — roughly a third the age of the universe.',
    },
  ],
  source: 'U.S. EPA · USDA · ICRP',
};

export const POTASSIUM = {
  id: 'potassium',
  term: 'Natural Potassium',
  tagline: 'The element that quietly powers the banana\'s glow.',
  facts: [
    {
      label: 'Element',
      value: 'Potassium (K)',
      note: 'Atomic number 19 — a soft, silvery-white alkali metal essential to every living cell.',
    },
    {
      label: 'Natural Abundance',
      value: '0.0117% as K-40',
      note: 'Three potassium isotopes occur in nature: K-39 (93.3%), K-40 (0.0117%), and K-41 (6.7%). Only K-40 is radioactive.',
    },
    {
      label: 'Half-life',
      value: '1.248 × 10⁹ years',
      note: 'Roughly a third the age of the universe — which is why K-40 is still around in measurable amounts. Curious how many bananas that would take? See [[lethal]]how many bananas to kill a person[[/lethal]].',
    },
    {
      label: 'In Bananas',
      value: '~0.5 g K each',
      note: 'A typical banana contains about half a gram of potassium — most of it the stable isotopes K-39 and K-41.',
    },
  ],
  source: 'ICRP · USGS · IUPAC',
};

export const LETHAL = {
  id: 'lethal',
  term: 'How many bananas to kill a person?',
  tagline: 'A lethal dose, banana-style.',
  palette: 'green',
  counter: {
    start: 0,
    end: 10000,
    duration: 1800,
    suffix: ' bananas',
    caption: 'Number of bananas you would have to eat in one sitting to reach a lethal radiation dose.',
  },
  facts: [
    {
      label: 'Lethal Dose (LD50)',
      value: '~10,000 bananas',
      note: 'Theoretically — the LD50 of radiation sits near 5,000 mSv. At 0.1 µSv per banana, that is roughly 50 million bananas for the median lethal dose.',
    },
    {
      label: 'Practical Limit',
      value: '~500 bananas',
      note: 'The potassium alone would kill you long before radiation. The body tightly regulates potassium — too much triggers cardiac arrest.',
    },
    {
      label: 'Calorie Wall',
      value: '~480 bananas',
      note: 'About 100,000 calories of banana in one sitting. Your stomach calls it quits well before the K-40 does.',
    },
    {
      label: 'Verdict',
      value: 'Bananas: 0 / Humans: 1',
      note: 'You would die of potassium-induced cardiac arrest before any K-40 even got a vote.',
    },
  ],
  source: 'EPA · ICRP · (calculations by us)',
};

export const FUTURE = {
  kicker: 'THE FUTURE',
  title: 'The Future of Nuclear in Tech',
  body: [
    'A company called NDB Inc. is partnering with Oak Ridge National Laboratory and others on nuclear energy-powered batteries that could revolutionize smartphones and make charging ports obsolete.',
    'According to the company, these batteries “could potentially last dozens, hundreds, or even thousands of years, and they would generate their own power from radiation.”',
    'Not to mention they would prevent the batteries used today from winding up in landfills.',
  ],
  coda:
    'So next time you check your watch or change the batteries in your smoke detector, think about the marvels of nuclear technology that make it possible!',
};

export const DOE = {
  id: 'doe',
  term: 'U.S. Department of Energy',
  tagline: 'Official U.S. Government source — verified and trusted.',
  palette: 'gov',
  source: 'energy.gov',
  facts: [
    {
      label: 'Domain',
      value: '.gov',
      note: 'A .gov domain belongs to an official government organization in the United States. Sites on .gov are vetted and operated by federal, state, local, or tribal authorities.',
    },
    {
      label: 'Trust Rating',
      value: '★★★★★ (5/5)',
      note: 'Government .gov sites are among the most authoritative sources on the public web. Information here is reviewed for accuracy and revised when new evidence emerges.',
    },
    {
      label: 'Publisher',
      value: 'U.S. Department of Energy',
      note: 'Cabinet-level department overseeing U.S. policy on nuclear energy, national labs, and the country’s power grid.',
    },
    {
      label: 'Why it matters',
      value: 'Primary source',
      note: 'Most of the statistics quoted in this dossier — radiation doses, isotope data, common household radioisotopes — were first published by .gov sites like this one.',
    },
  ],
};
