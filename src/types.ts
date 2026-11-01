import 'react';

// Allow CSS custom properties like `--hue` in inline styles.
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

export interface CustomOption {
  key: string;
  label: string;
  desc: string;
}

export interface Draft {
  title: string;
  timeOfDay: string;
  context: string;
  painMetaphor: string | null;
  painNote: string;
  places: string[];
  people: string[];
  placeNote: string;
  customPlaces: string[];
  customPeople: string[];
  selfLens: string | null;
  supportersLens: string | null;
  societyLens: string | null;
  lensNote: string;
  approach: string | null;
  approachNote: string;
  handlingPractices: string[];
  handlingWorked: string | null;
  handlingHelped: string[];
  handlingMissing: string[];
  handlingNote: string;
  nextPractices: string[];
  nextFromSelf: string[];
  nextFromSupporters: string[];
  nextFromSystems: string[];
  nextNote: string;
  custom: { metaphor: CustomOption[]; approach: CustomOption[] };
  createdAt: number;
}

export interface Journey extends Draft {
  id: string;
  savedAt: number;
}

type KeysOfType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T];

/** Draft fields holding one optional choice (toggled on/off). */
export type SingleField = { [K in keyof Draft]-?: null extends Draft[K] ? K : never }[keyof Draft];
/** Draft fields holding a list of choices. */
export type MultiField = KeysOfType<Draft, string[]>;
/** Free-text note fields. */
export type NoteField = 'painNote' | 'placeNote' | 'lensNote' | 'approachNote' | 'handlingNote' | 'nextNote';

export type LensField = 'selfLens' | 'supportersLens' | 'societyLens';

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;
export type Screen =
  | 'home' | 'setup' | 'overview' | 'complete' | 'share' | 'past' | 'insights'
  | `step${StepNumber}`;

export type ShareKey = 'pain' | 'place' | 'lens' | 'approach' | 'handled' | 'next';
export type ShareSections = Record<ShareKey, boolean>;

export type CustomDraftKind = 'metaphor' | 'approach' | 'place' | 'person';
export type CustomDrafts = Record<CustomDraftKind, string>;

export type PastView = 'list' | 'constellation';
