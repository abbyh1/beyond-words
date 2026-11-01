import type { Journey } from '../types';

interface InsightCard {
  key: string;
  hue: number;
  eyebrow: string;
  body: string;
}

function topByFrequency(values: string[]): { value: string; count: number } | null {
  const freq: Record<string, number> = {};
  values.forEach((v) => { freq[v] = (freq[v] || 0) + 1; });
  const top = Object.keys(freq).sort((a, b) => freq[b] - freq[a])[0];
  return top ? { value: top, count: freq[top] } : null;
}

function buildInsightCards(pastJourneys: Journey[]): InsightCard[] {
  if (pastJourneys.length < 2) return [];
  const cards: InsightCard[] = [];

  const topMetaphor = topByFrequency(pastJourneys.map((j) => j.painMetaphor).filter((m): m is string => !!m));
  if (topMetaphor && topMetaphor.count > 1) {
    cards.push({
      key: 'm', hue: 280, eyebrow: 'A recurring metaphor',
      body: `"${topMetaphor.value}" has shown up in ${topMetaphor.count} of your maps.`,
    });
  }

  const topMissing = topByFrequency(pastJourneys.flatMap((j) => j.handlingMissing || []));
  if (topMissing) {
    cards.push({
      key: 'n', hue: 30, eyebrow: 'Something you may need',
      body: `"${topMissing.value}" has come up more than once as something missing.`,
    });
  }

  const topHelped = topByFrequency(pastJourneys.flatMap((j) => j.handlingHelped || []));
  if (topHelped) {
    cards.push({
      key: 'h', hue: 165, eyebrow: 'What tends to help',
      body: `${topHelped.value} shows up often as something that helps.`,
    });
  }

  return cards;
}

interface InsightsProps {
  pastJourneys: Journey[];
  onBack: () => void;
  onStartNew: () => void;
}

export default function Insights({ pastJourneys, onBack, onStartNew }: InsightsProps) {
  const cards = buildInsightCards(pastJourneys);

  return (
    <div className="bw-screen">
      <div className="bw-header-row" style={{ padding: '20px 0 4px' }}>
        <button type="button" className="bw-back-btn" onClick={onBack}>←</button>
        <div className="bw-header-row__title--strong bw-quicksand">Something to reflect on</div>
      </div>
      <div className="bw-screen--body" style={{ padding: '14px 0 32px', gap: 16 }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          A few gentle things noticed across your maps. Nothing here is measured — only noticed.
        </div>

        {cards.length > 0 ? (
          <div className="bw-insight-cards">
            {cards.map((card) => (
              <div
                key={card.key}
                className="bw-insight-card"
                style={{ background: `oklch(93% 0.05 ${card.hue})`, color: `oklch(30% 0.08 ${card.hue})` }}
              >
                <div className="bw-insight-card__eyebrow">{card.eyebrow}</div>
                <div className="bw-insight-card__body">{card.body}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bw-empty-state bw-empty-state--tall">
            Complete a couple of episodes and gentle patterns will start to appear here.
          </div>
        )}

        <button type="button" className="bw-btn-primary bw-btn-primary--auto bw-quicksand" onClick={onStartNew}>
          Start New Episode
        </button>
      </div>
    </div>
  );
}
