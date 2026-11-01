import { buildSummaryClauses } from '../utils/draft';
import StoryNodes from './StoryNodes';
import type { Draft } from '../types';

interface CompleteProps {
  draft: Draft;
  onBack: () => void;
  onSave: () => void;
  onShare: () => void;
}

const TAG_HUES = [70, 30, 140];

export default function Complete({ draft, onBack, onSave, onShare }: CompleteProps) {
  const clauses = buildSummaryClauses(draft);
  const storyText = clauses.length ? clauses.join(' ') : 'This episode is still taking shape — every piece you add fills in more of the story.';
  const dateDisplay = new Date(draft.createdAt || Date.now()).toLocaleDateString(undefined, {
    month: 'long', day: 'numeric', year: 'numeric',
  }) + (draft.timeOfDay ? ` · ${draft.timeOfDay}` : '');

  const highlightTags = [...draft.handlingHelped, ...draft.nextFromSelf, ...draft.nextFromSupporters].slice(0, 3);

  return (
    <div className="bw-screen">
      <div className="bw-header-row" style={{ padding: '20px 0 4px' }}>
        <button type="button" className="bw-back-btn" onClick={onBack}>←</button>
        <div className="bw-header-row__title bw-quicksand">Your Episode Snapshot</div>
      </div>
      <div className="bw-screen--body" style={{ padding: '14px 0 32px' }}>
        <div className="bw-snapshot-card">
          <div>
            <div className="bw-snapshot-card__title bw-quicksand">{draft.title || 'Untitled episode'}</div>
            <div className="bw-snapshot-card__date">{dateDisplay}</div>
          </div>
          <div className="bw-snapshot-card__nodes">
            <StoryNodes draft={draft} size={46} variant="hero" />
          </div>
          <div className="bw-snapshot-card__story">{storyText}</div>
        </div>

        {highlightTags.length > 0 && (
          <div>
            <div className="bw-section-label" style={{ marginTop: 0, marginBottom: 8 }}>What mattered most</div>
            <div className="bw-highlight-tags">
              {highlightTags.map((tag, index) => (
                <div
                  key={`${tag}${index}`}
                  className="bw-highlight-tag"
                  style={{
                    background: `oklch(93% 0.05 ${TAG_HUES[index % 3]})`,
                    color: `oklch(32% 0.08 ${TAG_HUES[index % 3]})`,
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bw-actions-col">
          <button type="button" className="bw-btn-primary bw-quicksand" onClick={onSave}>Save to Past Journeys</button>
          <button type="button" className="bw-btn-secondary bw-quicksand" onClick={onShare}>Share / Export</button>
        </div>
      </div>
    </div>
  );
}
