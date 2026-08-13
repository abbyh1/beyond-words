export default function ChipList({ options, selected, onToggle, hue, multi = true }) {
  const isSelected = (label) => (multi ? selected.includes(label) : selected === label);

  return (
    <div className="bw-chip-row">
      {options.map((label) => (
        <button
          key={label}
          type="button"
          className="bw-chip"
          data-selected={isSelected(label)}
          style={{ '--hue': hue }}
          onClick={() => onToggle(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
