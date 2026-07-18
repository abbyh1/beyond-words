(function () {
  const data = window.BWData || {};

  function blankDraft() {
    return {
      title: '',
      timeOfDay: '',
      context: '',
      painMetaphor: null,
      painNote: '',
      places: [],
      people: [],
      placeNote: '',
      customPlaces: [],
      customPeople: [],
      selfLens: null,
      supportersLens: null,
      societyLens: null,
      lensNote: '',
      approach: null,
      approachNote: '',
      handlingPractices: [],
      handlingWorked: null,
      handlingHelped: [],
      handlingMissing: [],
      handlingNote: '',
      nextPractices: [],
      nextFromSelf: [],
      nextFromSupporters: [],
      nextFromSystems: [],
      nextNote: '',
      custom: { metaphor: [], approach: [] },
      createdAt: Date.now(),
    };
  }

  function shapeStyle(shape, size) {
    if (shape === 'circle') return `border-radius:50%;width:${size}px;height:${size}px;`;
    if (shape === 'square') return `border-radius:${Math.max(4, size * 0.22)}px;width:${size}px;height:${size}px;`;
    if (shape === 'diamond') return `border-radius:${Math.max(3, size * 0.14)}px;width:${size}px;height:${size}px;transform:rotate(45deg);`;
    if (shape === 'triangle') return `width:0;height:0;border-left:${size / 2}px solid transparent;border-right:${size / 2}px solid transparent;border-bottom:${size * 0.86}px solid TRIANGLECOLOR;`;
    return `width:${size}px;height:${size}px;`;
  }

  function buildOptionCard(component, list, selectedValue, field, hue) {
    return list.map((item) => {
      const key = item.key || item;
      const label = item.label || item;
      const desc = item.desc || '';
      const selected = selectedValue === (item.label || item);
      const isHovered = component.state.hoveredOption === key;
      return {
        key,
        label,
        desc,
        onClick: () => component.toggleSingle(field, item.label || item),
        onMouseEnter: () => component.setHovered(key),
        onMouseLeave: () => component.clearHovered(key),
        cardStyle: `cursor:pointer;padding:14px;border-radius:16px;background:${selected ? `oklch(93% 0.06 ${hue})` : 'oklch(99% 0.004 90)'};border:1.5px solid ${selected ? `oklch(62% 0.11 ${hue})` : 'oklch(90% 0.012 90)'};transition:background .15s ease,border-color .15s ease;position:relative;height:112px;overflow:hidden;`,
        dotStyle: `width:16px;height:16px;border-radius:5px;background:oklch(70% 0.11 ${hue});`,
        rowStyle: `cursor:pointer;padding:14px 16px;border-radius:16px;background:${selected ? `oklch(93% 0.06 ${hue})` : 'oklch(99% 0.004 90)'};border:1.5px solid ${selected ? `oklch(62% 0.11 ${hue})` : 'oklch(90% 0.012 90)'};`,
        descStyle: isHovered
          ? `font-size:12.5px;color:oklch(50% 0.02 280);margin-top:6px;opacity:1;transition:opacity .18s ease;`
          : `font-size:12.5px;color:oklch(50% 0.02 280);margin-top:6px;opacity:0;transition:opacity .18s ease;`,
      };
    });
  }

  function buildChipList(component, list, selected, field, hue, multi) {
    const isSel = (label) => (multi ? selected.includes(label) : selected === label);
    return list.map((label) => ({
      key: label,
      label,
      onClick: () => (multi ? component.toggleMulti(field, label) : component.toggleSingle(field, label)),
      style: `cursor:pointer;padding:10px 16px;border-radius:999px;font-size:14px;font-weight:500;background:${isSel(label) ? `oklch(62% 0.11 ${hue})` : 'oklch(99% 0.004 90)'};color:${isSel(label) ? 'white' : 'oklch(32% 0.02 280)'};border:1.5px solid ${isSel(label) ? `oklch(62% 0.11 ${hue})` : 'oklch(88% 0.012 90)'};`,
    }));
  }

  function makeStoryNodes(component, size, ringHue) {
    const d = component.state.draft || blankDraft();
    const filled = [
      !!d.painMetaphor,
      !!(d.places.length || d.people.length),
      !!(d.selfLens || d.supportersLens || d.societyLens),
      !!d.approach,
      !!d.handlingPractices.length,
      !!d.nextPractices.length,
    ];
    return data.STEP_META.map((m, i) => {
      const isFilled = filled[i];
      const isCurrent = ringHue != null && component.state.activeStep === i + 1;
      let base = shapeStyle(m.shape, size);
      const color = isFilled ? `oklch(68% 0.12 ${m.hue})` : (isCurrent ? `oklch(96% 0.02 ${m.hue})` : 'oklch(93% 0.01 90)');
      const border = isCurrent ? `2.5px solid oklch(55% 0.13 ${m.hue})` : (isFilled ? 'none' : `2px dashed oklch(82% 0.015 90)`);
      if (m.shape === 'triangle') {
        base = base.replace('TRIANGLECOLOR', color);
        base += `background:transparent;filter:${isCurrent ? `drop-shadow(0 0 0 2px oklch(55% 0.13 ${m.hue}))` : 'none'};`;
      } else {
        base += `background:${color};border:${border};box-shadow:${isFilled ? `0 3px 10px oklch(68% 0.12 ${m.hue} / 0.4)` : 'none'};`;
      }
      return {
        key: m.key,
        filled: isFilled,
        styleMini: shapeStyle(m.shape, 10) + `background:${isFilled ? `oklch(68% 0.12 ${m.hue})` : 'oklch(88% 0.012 90)'};${m.shape === 'triangle' ? '' : ''}`,
        styleHeader: base,
        styleHero: shapeStyle(m.shape, size).replace('TRIANGLECOLOR', color) + (m.shape !== 'triangle' ? `background:${color};border:${border};box-shadow:${isFilled ? `0 4px 14px oklch(68% 0.12 ${m.hue} / 0.4)` : 'none'};` : ''),
      };
    });
  }

  function buildSummaryClauses(draft) {
    const clauses = [];
    if (draft.painMetaphor) clauses.push(`This episode felt like a ${draft.painMetaphor.toLowerCase()}.`);
    if (draft.painNote) clauses.push(draft.painNote);
    if (draft.places.length || draft.people.length) clauses.push(`It happened${draft.places.length ? ' at ' + draft.places.join(' & ').toLowerCase() : ''}${draft.people.length ? ', with ' + draft.people.join(', ').toLowerCase() + ' around' : ', while alone'}.`);
    if (draft.selfLens || draft.supportersLens || draft.societyLens) clauses.push(`I saw myself as ${(draft.selfLens || 'uncertain').toLowerCase()}${draft.supportersLens ? `, my supporters as ${draft.supportersLens.toLowerCase()}` : ''}${draft.societyLens ? `, and the world felt ${draft.societyLens.toLowerCase()}` : ''}.`);
    if (draft.approach) clauses.push(`My approach was ${draft.approach.toLowerCase()}.`);
    if (draft.handlingPractices.length) clauses.push(`I handled it by ${draft.handlingPractices.join(', ').toLowerCase()}.`);
    if (draft.handlingHelped.length) clauses.push(`${draft.handlingHelped.join(', ')} helped most.`);
    if (draft.nextPractices.length) clauses.push(`Next time, I hope to lean on ${draft.nextPractices.join(', ').toLowerCase()}.`);
    return clauses;
  }

  window.BWUtils = {
    blankDraft,
    shapeStyle,
    buildOptionCard,
    buildChipList,
    makeStoryNodes,
    buildSummaryClauses,
  };
})();
