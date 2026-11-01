import { STEP_META } from '../data/content';
import { stepFilledFlags } from '../utils/draft';
import StoryNodes from './StoryNodes';
import type { Draft } from '../types';

interface OverviewProps {
  draft: Draft;
  activeStep: number;
  onBack: () => void;
  onStepClick: (step: number) => void;
  onContinue: () => void;
}

export default function Overview({ draft, activeStep, onBack, onStepClick, onContinue }: OverviewProps) {
  const filled = stepFilledFlags(draft);
  const anyFilled = filled.some(Boolean);

  return (
    <div className="bw-screen bw-screen--fast">
      <div className="bw-header-row">
        <button type="button" className="bw-back-btn" onClick={onBack}>←</button>
        <div className="bw-header-row__title bw-quicksand">{draft.title || 'Untitled episode'}</div>
      </div>
      <div className="bw-screen--body" style={{ padding: '14px 0 32px' }}>
        <div>
          <div className="bw-title-xl bw-quicksand">Six gentle steps</div>
          <div className="bw-subtitle">Move through your episode one piece at a time — tap any step, in any order.</div>
        </div>

        <div className="bw-progress-row">
          <StoryNodes draft={draft} size={30} variant="header" activeStep={activeStep} />
        </div>

        <div className="bw-step-rows">
          {STEP_META.map((item, index) => (
            <button
              key={item.key}
              type="button"
              className="bw-step-row"
              onClick={() => onStepClick(index + 1)}
            >
              <div
                className="bw-node bw-node--mini"
                data-shape={item.shape}
                data-filled={filled[index]}
                style={{ '--size': '30px', '--hue': item.hue }}
              />
              <div className="bw-step-row__body">
                <div className="bw-step-row__label">{item.label}</div>
                <div className="bw-step-row__subtitle">{filled[index] ? 'Done — tap to edit' : item.subtitle}</div>
              </div>
              <div className="bw-step-row__trailing">{filled[index] ? '✓' : '›'}</div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
          <button type="button" className="bw-btn-primary bw-quicksand" onClick={onContinue}>
            {anyFilled ? 'Continue' : 'Begin Map'}
          </button>
          <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted-2)' }}>
            You can pause, skip, or edit anytime.
          </div>
        </div>
      </div>
    </div>
  );
}
