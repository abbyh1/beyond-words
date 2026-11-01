import { STEP_META } from '../data/content';
import { stepFilledFlags } from '../utils/draft';
import type { Draft } from '../types';

interface StoryNodesProps {
  draft: Draft;
  size: number;
  variant?: 'header' | 'mini' | 'hero';
  activeStep?: number | null;
}

export default function StoryNodes({ draft, size, variant = 'header', activeStep = null }: StoryNodesProps) {
  const filled = stepFilledFlags(draft);
  const rowClass = variant === 'mini' ? 'bw-story-row bw-story-row--mini' : variant === 'hero' ? 'bw-story-row' : 'bw-story-row bw-story-row--header';
  const nodeClass = variant === 'mini' ? 'bw-node bw-node--mini' : 'bw-node';

  return (
    <div className={rowClass}>
      {STEP_META.map((meta, index) => (
        <div
          key={meta.key}
          className={nodeClass}
          data-shape={meta.shape}
          data-filled={filled[index]}
          data-current={variant === 'header' && activeStep === index + 1}
          style={{ '--size': `${size}px`, '--hue': meta.hue }}
        />
      ))}
    </div>
  );
}
