import { TIME_OF_DAY } from '../data/content';
import ChipList from './ChipList';
import type { Draft } from '../types';

interface SetupProps {
  draft: Draft;
  onBack: () => void;
  onTitleChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onTimeOfDay: (value: string) => void;
  onBegin: () => void;
}

export default function Setup({ draft, onBack, onTitleChange, onContextChange, onTimeOfDay, onBegin }: SetupProps) {
  return (
    <div className="bw-screen bw-screen--fast">
      <div className="bw-header-row">
        <button type="button" className="bw-back-btn" onClick={onBack}>←</button>
        <div className="bw-header-row__title bw-quicksand">New Episode</div>
      </div>
      <div className="bw-screen--body" style={{ padding: '16px 0 32px' }}>
        <div>
          <div className="bw-title-xl bw-quicksand">Let's set the scene</div>
          <div className="bw-subtitle">A few gentle details before we begin. Skip anything you'd rather not answer.</div>
        </div>

        <label className="bw-field">
          <span className="bw-field__label">Name this episode</span>
          <input
            className="bw-input"
            value={draft.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Back flare after a long day"
          />
        </label>

        <div className="bw-field">
          <span className="bw-field__label">When would you say this happened?</span>
          <ChipList
            options={TIME_OF_DAY}
            selected={draft.timeOfDay}
            onToggle={onTimeOfDay}
            hue={280}
            multi={false}
          />
        </div>

        <label className="bw-field">
          <span className="bw-field__label">
            What was happening? <span className="bw-field__label-optional">(optional)</span>
          </span>
          <textarea
            className="bw-textarea"
            rows={2}
            value={draft.context}
            onChange={(e) => onContextChange(e.target.value)}
            placeholder="A short line, if you like..."
          />
        </label>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 10 }}>
          <button type="button" className="bw-btn-primary bw-quicksand" onClick={onBegin}>
            Begin Map
          </button>
          <button type="button" className="bw-link-plain" onClick={onBack}>
            Save and exit
          </button>
        </div>
      </div>
    </div>
  );
}
