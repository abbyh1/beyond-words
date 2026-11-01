import type { LensField, ShareKey } from '../types';

export type NodeShape = 'circle' | 'square' | 'diamond' | 'triangle';

export interface StepMeta {
  key: string;
  label: string;
  hue: number;
  shape: NodeShape;
  subtitle: string;
}

export interface Option {
  key: string;
  label: string;
  desc?: string;
}

export const STEP_META: StepMeta[] = [
  { key: 'pain', label: 'Pain Experience', hue: 280, shape: 'circle', subtitle: 'Tap to begin' },
  { key: 'place', label: 'Place & People', hue: 230, shape: 'square', subtitle: 'Where and who' },
  { key: 'lens', label: 'Through Metaphors', hue: 165, shape: 'diamond', subtitle: 'How you saw it' },
  { key: 'approach', label: 'My Approach', hue: 140, shape: 'triangle', subtitle: 'How you responded' },
  { key: 'handled', label: 'How I Handled It', hue: 70, shape: 'circle', subtitle: 'What you practiced' },
  { key: 'next', label: 'Next Care Move', hue: 30, shape: 'square', subtitle: 'What might help' },
];

export const METAPHORS: Option[] = [
  { key: 'shadow', label: 'Shadow', desc: 'It felt like something always there, following me around.' },
  { key: 'storm', label: 'Storm', desc: 'It felt unpredictable and intense, coming in waves.' },
  { key: 'cage', label: 'Cage', desc: 'It felt like being restricted, my freedom limited.' },
  { key: 'companion', label: 'Companion', desc: 'It felt like a constant presence, part of daily life.' },
  { key: 'battle', label: 'Battle', desc: 'It felt like fighting something strong.' },
  { key: 'weight', label: 'Heavy Weight', desc: 'It felt heavy weight, dragging me down.' },
  { key: 'fog', label: 'Fog', desc: 'It felt cloudy, dulling my thinking/awareness.' },
  { key: 'fire', label: 'Fire', desc: 'It felt burning and sharp.' },
  { key: 'thief', label: 'Thief', desc: 'It felt like something stealing joys and shrinking life.' },
  { key: 'teacher', label: 'Teacher', desc: 'It felt like something guiding me to my limits and strengths.' },
  { key: 'signal', label: 'Signal', desc: 'It felt like a cue helping me understand my body’s needs.' },
];

export const PLACES = ['Home', 'Work', 'Public space', 'Clinic', 'Traveling'];
export const PEOPLE = ['Alone', 'Partner', 'Family / loved ones', 'Friends', 'Coworkers'];

export const LENS_METAPHORS: Option[] = [
  'Shadowed Self', 'Warrior', 'Actor', 'Invisible', 'Survivor', 'Fragile', 'Burden', 'Traveler',
  'Squeaky Wheel', 'Shield', 'Companion', 'Leaky Boat', 'Guide', 'Scientist', 'Phoenix', 'Lighthouse',
  'Architect', 'Anchor', 'Angel', 'Open Ear', 'Rock', 'Cheerleader', 'Mirror',
].map((label) => ({ key: label.toLowerCase().replace(/\s+/g, ''), label }));

export const LENS_TABS: { key: LensField; label: string; prompt: string }[] = [
  { key: 'selfLens', label: 'Myself', prompt: 'How did you see yourself?' },
  { key: 'supportersLens', label: 'Supporters', prompt: 'How did you see your supporter/s?' },
  { key: 'societyLens', label: 'Others', prompt: 'How did others see you?' },
];

export const APPROACHES: Option[] = [
  { key: 'holding', label: 'Holding It Together', desc: 'Keeping things running' },
  { key: 'managing', label: 'Managing the Load', desc: 'Pacing and adjusting' },
  { key: 'stepping', label: 'Fighting to Be Seen', desc: 'Pushing to be noticed and heard' },
  { key: 'pushing', label: 'Finding Bearings', desc: 'Reorienting yourself and adapting' },
];

export const HANDLING = ['Reflecting', 'Expressing', 'Resting', 'Being mindful', 'Distracting myself'];
export const WORKED = ['Yes', 'No', 'Not sure'];
export const HELPED = ['Rest', 'Heat pack', 'Partner support', 'Quiet time', 'Breathing', 'Movement'];
export const MISSING = ['More flexibility', 'Less noise', 'More support', 'Privacy', 'Time'];
export const NEXT_PRACTICES = ['Rest', 'Being mindful', 'Gentle movement', 'Talking to someone', 'Adjusting plans'];
export const FROM_SELF = ['Patience', 'Rest', 'Permission to pause'];
export const FROM_SUPPORTERS = ['Check-in', 'Understanding', 'Help with tasks'];
export const FROM_SYSTEMS = ['Flexibility at work', 'Transportation', 'Medical support', 'Quiet space'];

export const TIME_OF_DAY = ['Morning', 'Afternoon', 'Evening', 'Night'];

export const SHARE_LABELS: Record<ShareKey, string> = {
  pain: 'Pain metaphor',
  place: 'Place & people',
  lens: 'Self & others',
  approach: 'My approach',
  handled: 'How I handled it',
  next: 'Next care move',
};
