import type { Option } from '../data/content';

interface OptionCardProps {
  item: Option;
  selected: boolean;
  onClick: () => void;
  hue: number;
  variant?: 'card' | 'compact' | 'row';
}

export default function OptionCard({ item, selected, onClick, hue, variant = 'card' }: OptionCardProps) {
  const label = item.label;
  const desc = item.desc || '';

  return (
    <button
      type="button"
      className={`bw-option bw-option--${variant}`}
      data-selected={selected}
      style={{ '--hue': hue }}
      onClick={onClick}
    >
      {variant === 'card' && <div className="bw-option-dot" />}
      <div className="bw-option-label">{label}</div>
      {desc && <div className="bw-option-desc">{desc}</div>}
    </button>
  );
}
