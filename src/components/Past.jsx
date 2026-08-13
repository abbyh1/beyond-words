import { STEP_META } from '../data/content.js';
import { stepFilledFlags } from '../utils/draft.js';

export default function Past({ pastJourneys, pastView, onSetList, onSetConstellation, onBack, onStartNew }) {
  return (
    <div className="bw-screen">
      <div className="bw-header-row" style={{ padding: '20px 0 4px' }}>
        <button type="button" className="bw-back-btn" onClick={onBack}>←</button>
        <div className="bw-header-row__title--strong bw-quicksand" style={{ flex: 1 }}>My Pain Episode Maps</div>
      </div>
      <div className="bw-screen--body" style={{ padding: '14px 0 32px', gap: 18 }}>
        <div className="bw-tab-row">
          <button type="button" className="bw-tab" data-active={pastView === 'list'} onClick={onSetList}>List</button>
          <button type="button" className="bw-tab" data-active={pastView === 'constellation'} onClick={onSetConstellation}>Constellation</button>
        </div>

        {pastView === 'list' && (
          pastJourneys.length > 0 ? (
            <div className="bw-past-list">
              {pastJourneys.map((journey) => {
                const filled = stepFilledFlags(journey);
                const subtitle = new Date(journey.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                  + (journey.painMetaphor ? ` · ${journey.painMetaphor}` : '');
                return (
                  <div key={journey.id} className="bw-past-card">
                    <div className="bw-past-card__row">
                      <div className="bw-past-card__title">{journey.title || 'Untitled episode'}</div>
                      <div className="bw-past-card__badge">Complete</div>
                    </div>
                    <div className="bw-past-card__subtitle">{subtitle}</div>
                    <div className="bw-past-card__nodes">
                      {STEP_META.map((item, index) => (
                        <div
                          key={item.key}
                          className="bw-node bw-node--mini"
                          data-shape={item.shape}
                          data-filled={filled[index]}
                          style={{ '--size': '10px', '--hue': item.hue }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bw-empty-state">Your saved journeys will appear here once you complete one.</div>
          )
        )}

        {pastView === 'constellation' && (
          <div className="bw-constellation">
            <div className="bw-constellation__center bw-quicksand">My maps</div>
            {pastJourneys.slice(0, 6).map((journey, index) => {
              const angle = (index / Math.max(pastJourneys.length, 1)) * 2 * Math.PI;
              const x = 50 + Math.cos(angle) * 30;
              const y = 50 + Math.sin(angle) * 38;
              return (
                <div
                  key={journey.id}
                  className="bw-constellation__star bw-quicksand"
                  style={{ '--x': `${x}%`, '--y': `${y}%`, '--star-hue': 200 + index * 30 }}
                >
                  {journey.painMetaphor || 'Episode'}
                </div>
              );
            })}
          </div>
        )}

        <button type="button" className="bw-btn-primary bw-btn-primary--auto bw-quicksand" onClick={onStartNew}>
          + New Episode
        </button>
      </div>
    </div>
  );
}
