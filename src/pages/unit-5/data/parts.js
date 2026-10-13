// 5 parts of the Mausoleum — annotated presentation.
//
// Each part drives the "archaeological investigation terminal"
// stage: a large still image with annotation pins on the photo,
// each connected to a floating info box by an animated SVG line.
//
// The title card (FIG.XX · TITLE · CAPTION) is itself a connected
// panel — it sits at the bottom-centre of the stage and connects
// to a pin at the very bottom of the image. This way every piece
// of slide content is presented as a connected box.
//
// Coordinate system:
//   • `image`               path under /public OR a JS-imported asset
//   • `annotations[].x/y`   normalized 0-100 (% of the image box).
//   • `annotations[].side`  'tl' | 'tr' | 'bl' | 'br' | 'l' | 'r'
//   • `annotations[].variant`  visual treatment:
//        archival  — default full dossier card with tab + notch
//        technical — measurement slab, ruled grid, monospace
//        evidence  — claim with caveat, red UNVERIFIED stamp
//        compact   — one-liner slab, no title chrome
//        header    — slide title + caption, sits at the bottom
//
// The number of annotations per slide is also data-driven: 2-4
// per slide depending on how much the content actually has to say.

import part1 from './part1.jpg';
import part2 from './part2.jpg';
import part3 from './part3.jpg';
import part4 from './part4.jpg';

const titleAnn = (id) => ({
  id,
  x: 50, y: 100,
  side: 'b',
  variant: 'header',
  isHeader: true,
  noMarker: true,
});

export const PARTS = [
  {
    id: 'location',
    code: '01',
    title: 'THE MAUSOLEUM',
    icon: 'pin',
    caption: 'XI’AN · CHINA',
    stamp: 'SHANXI · 221 BCE',
    image: part1,
    line1: 'An army that would serve him even after death.',
    line2: '',
    annotations: [
      {
        id: 'a1',
        x: 50, y: 38,
        side: 'tr',
        variant: 'archival',
        title: 'LOCATION',
        text: [
          'Near Xi’an, China.',
        ],
        ref: 'NEAR XI’AN',
      },
      {
        id: 'a2',
        x: 50, y: 64,
        side: 'bl',
        variant: 'technical',
        title: 'THE EMPEROR',
        text: [
          'Qin Shi Huang.',
        ],
        ref: 'QIN SHI HUANG',
      },
      titleAnn('a0'),
    ],
  },
  {
    id: 'army',
    code: '02',
    title: 'THE TERRACOTTA ARMY',
    icon: 'soldier',
    caption: '8,000+ CLAY FIGURES',
    stamp: 'PIT 1 · 1974',
    image: part2,
    line1: 'An army of thousands, yet no two stories feel the same.',
    line2: '',
    annotations: [
      {
        id: 'b1',
        x: 50, y: 30,
        side: 'tr',
        variant: 'archival',
        title: 'ARTISTIC EXCELLENCE',
        text: [
          'A unique blend of history, architecture, and sculpture.',
        ],
        ref: '',
      },
      {
        id: 'b2',
        x: 50, y: 62,
        side: 'bl',
        variant: 'technical',
        title: 'UNIQUE FEATURES',
        text: [
          'Different faces, clothing, and hairstyles make each soldier distinct.',
        ],
        ref: '',
      },
      {
        id: 'b3',
        x: 18, y: 78,
        side: 'tl',
        variant: 'evidence',
        title: 'REALISTIC CHARACTERS',
        text: [
          'The soldiers look like real people, each with their own identity and role.',
        ],
        ref: '',
      },
      titleAnn('b0'),
    ],
  },
  {
    id: 'artistry',
    code: '03',
    title: 'THE PEOPLE WHO MADE HISTORY',
    icon: 'brush',
    caption: 'NO TWO FACES ALIKE',
    stamp: 'QIN · 210 BCE',
    image: part3,
    line1: 'Legends are not born in a day, but carved in stone and clay.',
    line2: '',
    annotations: [
      {
        id: 'c1',
        x: 50, y: 34,
        side: 'tr',
        variant: 'archival',
        title: 'UNKNOWN ARTISANS',
        text: [
          'Most artists’ names remain unknown.',
        ],
        ref: '',
      },
      {
        id: 'c2',
        x: 50, y: 70,
        side: 'bl',
        variant: 'evidence',
        title: 'ETERNAL LEGACY',
        text: [
          'Their work survives after 2,000 years.',
        ],
        ref: '',
      },
      titleAnn('c0'),
    ],
  },
  {
    id: 'mystery',
    code: '04',
    title: 'THE UNOPENED TOMB',
    icon: 'lock',
    caption: 'CLASSIFIED · UNEXCAVATED',
    stamp: 'SEALED · 221 BCE',
    image: part4,
    line1: 'It is old, enormous, and still full of secrets!',
    line2: '',
    annotations: [
      {
        id: 'd1',
        x: 50, y: 34,
        side: 'tr',
        variant: 'evidence',
        title: 'HIDDEN SECRETS',
        text: [
          'Ancient records describe rivers of mercury and miniature palaces inside.',
        ],
        ref: '',
      },
      {
        id: 'd2',
        x: 50, y: 70,
        side: 'bl',
        variant: 'archival',
        title: 'HISTORICAL SIGNIFICANCE',
        text: [
          'It reveals the skills, history, and mysteries of ancient China.',
        ],
        ref: '',
      },
      titleAnn('d0'),
    ],
  },
  {
    id: 'reflection',
    code: '05',
    title: 'A LEGACY IN ART',
    icon: 'star',
    caption: 'SKILL · HISTORY · MYSTERY',
    stamp: 'CONCLUSION',
    image: '/unit-5/05-legacy.svg',
    line1: 'Thank you.',
    line2: '',
    annotations: [
      titleAnn('e0'),
    ],
    hiddenInNav: true,
  },
];
