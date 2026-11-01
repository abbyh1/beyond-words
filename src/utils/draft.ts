import type { Draft } from '../types';

export function blankDraft(): Draft {
  return {
    title: '',
    timeOfDay: '',
    context: '',
    painMetaphor: null,
    painNote: '',
    places: [],
    people: [],
    placeNote: '',
    customPlaces: [],
    customPeople: [],
    selfLens: null,
    supportersLens: null,
    societyLens: null,
    lensNote: '',
    approach: null,
    approachNote: '',
    handlingPractices: [],
    handlingWorked: null,
    handlingHelped: [],
    handlingMissing: [],
    handlingNote: '',
    nextPractices: [],
    nextFromSelf: [],
    nextFromSupporters: [],
    nextFromSystems: [],
    nextNote: '',
    custom: { metaphor: [], approach: [] },
    createdAt: Date.now(),
  };
}

export function stepFilledFlags(draft: Draft | null): boolean[] {
  const d = draft || blankDraft();
  return [
    !!d.painMetaphor,
    !!(d.places.length || d.people.length),
    !!(d.selfLens || d.supportersLens || d.societyLens),
    !!d.approach,
    !!d.handlingPractices.length,
    !!d.nextPractices.length,
  ];
}

export function buildSummaryClauses(draft: Draft): string[] {
  const clauses: string[] = [];
  if (draft.painMetaphor) clauses.push(`This episode felt like a ${draft.painMetaphor.toLowerCase()}.`);
  if (draft.painNote) clauses.push(draft.painNote);
  if (draft.places.length || draft.people.length) {
    clauses.push(
      `It happened${draft.places.length ? ' at ' + draft.places.join(' & ').toLowerCase() : ''}${
        draft.people.length ? ', with ' + draft.people.join(', ').toLowerCase() + ' around' : ', while alone'
      }.`
    );
  }
  if (draft.selfLens || draft.supportersLens || draft.societyLens) {
    clauses.push(
      `I saw myself as ${(draft.selfLens || 'uncertain').toLowerCase()}${
        draft.supportersLens ? `, my supporters as ${draft.supportersLens.toLowerCase()}` : ''
      }${draft.societyLens ? `, and the world felt ${draft.societyLens.toLowerCase()}` : ''}.`
    );
  }
  if (draft.approach) clauses.push(`My approach was ${draft.approach.toLowerCase()}.`);
  if (draft.handlingPractices.length) clauses.push(`I handled it by ${draft.handlingPractices.join(', ').toLowerCase()}.`);
  if (draft.handlingHelped.length) clauses.push(`${draft.handlingHelped.join(', ')} helped most.`);
  if (draft.nextPractices.length) clauses.push(`Next time, I hope to lean on ${draft.nextPractices.join(', ').toLowerCase()}.`);
  return clauses;
}
