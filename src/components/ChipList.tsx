interface ChipListProps {
  options: string[];
  selected: string[] | string | null;
  onToggle: (label: string) => void;
  hue: number;
  multi?: boolean;
}

export default function ChipList({ options, selected, onToggle, hue, multi = true }: ChipListProps) {
  const isSelected = (label: string) => (multi && Array.isArray(selected) ? selected.includes(label) : selected === label);

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
