import { SHARE_LABELS } from '../data/content';
import type { Draft, ShareKey, ShareSections } from '../types';

function sentence(parts: (string | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

function buildShareSections(draft: Draft): Record<ShareKey, string> {
  return {
    pain: sentence([
      draft.painMetaphor ? `This episode felt like a ${draft.painMetaphor.toLowerCase()}.` : '',
      draft.painNote,
    ]),
    place: sentence([
      draft.places.length || draft.people.length
        ? `It happened${draft.places.length ? ' at ' + draft.places.join(' & ').toLowerCase() : ''}${
            draft.people.length ? ', with ' + draft.people.join(', ').toLowerCase() + ' around' : ', while alone'
          }.`
        : '',
      draft.placeNote,
    ]),
    lens: sentence([
      draft.selfLens || draft.supportersLens || draft.societyLens
        ? `I saw myself as ${(draft.selfLens || 'uncertain').toLowerCase()}${
            draft.supportersLens ? `, my supporters as ${draft.supportersLens.toLowerCase()}` : ''
          }${draft.societyLens ? `, and the world felt ${draft.societyLens.toLowerCase()}` : ''}.`
        : '',
      draft.lensNote,
    ]),
    approach: sentence([
      draft.approach ? `My approach was ${draft.approach.toLowerCase()}.` : '',
      draft.approachNote,
    ]),
    handled: sentence([
      draft.handlingPractices.length ? `I handled it by ${draft.handlingPractices.join(', ').toLowerCase()}.` : '',
      draft.handlingWorked
        ? `It ${
            draft.handlingWorked === 'Yes' ? 'worked well' : draft.handlingWorked === 'No' ? 'did not work well' : 'may or may not have worked'
          }.`
        : '',
      draft.handlingHelped.length ? `${draft.handlingHelped.join(', ')} helped most.` : '',
      draft.handlingMissing.length ? `What was missing: ${draft.handlingMissing.join(', ').toLowerCase()}.` : '',
      draft.handlingNote,
    ]),
    next: sentence([
      draft.nextPractices.length ? `Next time, I hope to lean on ${draft.nextPractices.join(', ').toLowerCase()}.` : '',
      draft.nextFromSelf.length ? `From myself: ${draft.nextFromSelf.join(', ').toLowerCase()}.` : '',
      draft.nextFromSupporters.length ? `From supporters: ${draft.nextFromSupporters.join(', ').toLowerCase()}.` : '',
      draft.nextFromSystems.length ? `From systems/society: ${draft.nextFromSystems.join(', ').toLowerCase()}.` : '',
      draft.nextNote,
    ]),
  };
}

export function buildShareText(draft: Draft, shareSections: ShareSections): string {
  const sections = buildShareSections(draft);
  const dateDisplay = new Date(draft.createdAt || Date.now()).toLocaleDateString(undefined, {
    month: 'long', day: 'numeric', year: 'numeric',
  }) + (draft.timeOfDay ? ` · ${draft.timeOfDay}` : '');

  const lines = [draft.title || 'Untitled episode', dateDisplay, ''];

  (Object.keys(SHARE_LABELS) as ShareKey[]).forEach((key) => {
    if (!shareSections[key] || !sections[key]) return;
    lines.push(`${SHARE_LABELS[key]}:`, sections[key], '');
  });

  return lines.join('\n').trim();
}

export function shareFileName(draft: Draft): string {
  const slug = (draft.title || 'pain-episode').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${slug || 'pain-episode'}.txt`;
}

export function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
