import StoryNodes from './StoryNodes';
import type { Draft } from '../types';

interface HomeProps {
  draft: Draft | null;
  onResume: () => void;
  onStartNew: () => void;
  onGoPast: () => void;
  onGoInsights: () => void;
}

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.';
}

export default function Home({ draft, onResume, onStartNew, onGoPast, onGoInsights }: HomeProps) {
  return (
    <div className="bw-screen bw-screen--home">
      <div style={{ marginTop: 10 }}>
        <div className="bw-greeting bw-quicksand">{greeting()}</div>
        <div className="bw-greeting-sub">
          A gentle space to describe your pain in your own words — through metaphor, story, and reflection.
        </div>
      </div>

      {draft && (
        <button type="button" className="bw-resume-card" onClick={onResume}>
          <div className="bw-resume-card__row">
            <div className="bw-resume-card__label bw-quicksand">Continue where you left off</div>
            <div className="bw-resume-card__cta">Resume →</div>
          </div>
          <div className="bw-resume-card__title">{draft.title || 'Untitled episode'}</div>
          <StoryNodes draft={draft} size={10} variant="mini" />
        </button>
      )}

      <div className="bw-home-actions">
        <button type="button" className="bw-btn-primary bw-quicksand" onClick={onStartNew}>
          Start New Episode
        </button>
        <button type="button" className="bw-btn-secondary bw-quicksand" onClick={onGoPast}>
          View Past Journeys
        </button>
        <button type="button" className="bw-btn-text" onClick={onGoInsights}>
          Something to reflect on
        </button>
      </div>

      <div className="bw-home-footer">
        Nothing is shared unless you choose to. This is your private space — move at your own pace.
      </div>
    </div>
  );
}
