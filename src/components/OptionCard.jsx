export default function OptionCard({ item, selected, onClick, hue, variant = 'card' }) {
  const label = item.label || item;
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
