(function () {
  const data = window.BWData || {};
  const utils = window.BWUtils || {};

  function buildJourneysView(component) {
    const state = component.state;
    const pastRows = state.pastJourneys.map((journey) => ({
      key: journey.id,
      title: journey.title || 'Untitled episode',
      subtitle: new Date(journey.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + (journey.painMetaphor ? ' · ' + journey.painMetaphor : ''),
      badgeStyle: 'font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;background:oklch(90% 0.06 165);color:oklch(30% 0.08 165);white-space:nowrap;',
      nodes: data.STEP_META.map((item, index) => {
        const filled = [!!journey.painMetaphor, !!((journey.places && journey.places.length) || (journey.people && journey.people.length)), !!(journey.selfLens || journey.supportersLens || journey.societyLens), !!journey.approach, !!(journey.handlingPractices && journey.handlingPractices.length), !!(journey.nextPractices && journey.nextPractices.length)][index];
        return {
          key: item.key,
          styleMini: utils.shapeStyle(item.shape, 10) + `background:${filled ? `oklch(68% 0.12 ${item.hue})` : 'oklch(88% 0.012 90)'};`,
        };
      }),
    }));

    const constellationNodes = state.pastJourneys.slice(0, 6).map((journey, index) => {
      const angle = (index / Math.max(state.pastJourneys.length, 1)) * 2 * Math.PI;
      const x = 50 + Math.cos(angle) * 30;
      const y = 50 + Math.sin(angle) * 38;
      return {
        key: journey.id,
        label: journey.painMetaphor || 'Episode',
        style: `position:absolute;left:${x}%;top:${y}%;transform:translate(-50%,-50%);width:48px;height:48px;border-radius:50%;background:oklch(60% 0.1 ${200 + index * 30});color:white;display:flex;align-items:center;justify-content:center;font-size:10px;text-align:center;font-family:Quicksand,sans-serif;font-weight:600;box-shadow:0 0 16px oklch(60% 0.1 ${200 + index * 30} / 0.5);`,
      };
    });

    let insightCards = [];
    if (state.pastJourneys.length >= 2) {
      const metaphors = state.pastJourneys.map((journey) => journey.painMetaphor).filter(Boolean);
      const metaphorFreq = {};
      metaphors.forEach((metaphor) => {
        metaphorFreq[metaphor] = (metaphorFreq[metaphor] || 0) + 1;
      });
      const topMetaphor = Object.keys(metaphorFreq).sort((left, right) => metaphorFreq[right] - metaphorFreq[left])[0];
      if (topMetaphor && metaphorFreq[topMetaphor] > 1) insightCards.push({ key: 'm', eyebrow: 'A recurring metaphor', body: `"${topMetaphor}" has shown up in ${metaphorFreq[topMetaphor]} of your maps.`, style: 'padding:16px;border-radius:18px;background:oklch(93% 0.05 280);color:oklch(30% 0.08 280);' });

      const missing = state.pastJourneys.flatMap((journey) => journey.handlingMissing || []);
      const missingFreq = {};
      missing.forEach((item) => {
        missingFreq[item] = (missingFreq[item] || 0) + 1;
      });
      const topMissing = Object.keys(missingFreq).sort((left, right) => missingFreq[right] - missingFreq[left])[0];
      if (topMissing) insightCards.push({ key: 'n', eyebrow: 'Something you may need', body: `"${topMissing}" has come up more than once as something missing.`, style: 'padding:16px;border-radius:18px;background:oklch(93% 0.05 30);color:oklch(30% 0.08 30);' });

      const helped = state.pastJourneys.flatMap((journey) => journey.handlingHelped || []);
      const helpedFreq = {};
      helped.forEach((item) => {
        helpedFreq[item] = (helpedFreq[item] || 0) + 1;
      });
      const topHelped = Object.keys(helpedFreq).sort((left, right) => helpedFreq[right] - helpedFreq[left])[0];
      if (topHelped) insightCards.push({ key: 'h', eyebrow: 'What tends to help', body: `${topHelped} shows up often as something that helps.`, style: 'padding:16px;border-radius:18px;background:oklch(93% 0.05 165);color:oklch(30% 0.08 165);' });
    }

    return {
      setPastList: component.setPastList,
      setPastConstellation: component.setPastConstellation,
      pastListTabStyle: `flex:1;text-align:center;padding:9px;border-radius:11px;cursor:pointer;font-size:13.5px;font-weight:600;background:${state.pastView === 'list' ? 'white' : 'transparent'};box-shadow:${state.pastView === 'list' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'};`,
      pastConstellationTabStyle: `flex:1;text-align:center;padding:9px;border-radius:11px;cursor:pointer;font-size:13.5px;font-weight:600;background:${state.pastView === 'constellation' ? 'white' : 'transparent'};box-shadow:${state.pastView === 'constellation' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'};`,
      pastViewIsList: state.pastView === 'list',
      pastViewIsConstellation: state.pastView === 'constellation',
      hasPastJourneys: state.pastJourneys.length > 0,
      noPastJourneys: state.pastJourneys.length === 0,
      pastRows,
      constellationNodes,
      hasInsights: insightCards.length > 0,
      noInsights: insightCards.length === 0,
      insightCards,
    };
  }

  window.BWPages = window.BWPages || {};
  window.BWPages.journeys = { buildJourneysView };
})();
