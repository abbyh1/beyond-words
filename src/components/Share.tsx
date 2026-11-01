import { SHARE_LABELS } from '../data/content';
import type { ShareKey, ShareSections } from '../types';

interface ShareProps {
  shareSections: ShareSections;
  shareResult: string | null;
  onBack: () => void;
  onToggleSection: (key: ShareKey) => void;
  onConfirm: () => void;
}

export default function Share({ shareSections, shareResult, onBack, onToggleSection, onConfirm }: ShareProps) {
  return (
    <div className="bw-screen">
      <div className="bw-header-row" style={{ padding: '20px 0 4px' }}>
        <button type="button" className="bw-back-btn" onClick={onBack}>←</button>
        <div className="bw-header-row__title bw-quicksand">Choose what to share</div>
      </div>
      <div className="bw-screen--body" style={{ padding: '14px 0 32px', gap: 18 }}>
        <div className="bw-share-banner">Only share what feels comfortable. You can hide any section.</div>

        <div className="bw-share-rows">
          {(Object.keys(SHARE_LABELS) as ShareKey[]).map((key) => (
            <button key={key} type="button" className="bw-share-row" onClick={() => onToggleSection(key)}>
              <div className="bw-share-row__check" data-checked={shareSections[key]} />
              <div className="bw-share-row__label">{SHARE_LABELS[key]}</div>
            </button>
          ))}
        </div>

        {shareResult && (
          <div className="bw-share-confirm">{shareResult}</div>
        )}

        <div className="bw-actions-col" style={{ marginTop: 'auto' }}>
          <button type="button" className="bw-btn-primary bw-quicksand" onClick={onConfirm}>Share</button>
          <button type="button" className="bw-link-plain" onClick={onBack}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
