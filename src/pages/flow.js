(function () {
  const data = window.BWData || {};
  const utils = window.BWUtils || {};

  function buildFlowView(component) {
    const state = component.state;
    const draft = state.draft || utils.blankDraft();
    const screen = state.screen;
    const isStepScreen = /^step[1-6]$/.test(screen);
    const stepNumber = isStepScreen ? parseInt(screen.replace('step', ''), 10) : state.activeStep;
    const stepMeta = data.STEP_META[stepNumber - 1] || data.STEP_META[0];

    const storyNodesMini = component.makeStoryNodes(10, null);
    const storyNodesHeader = component.makeStoryNodes(30, true);
    const storyNodesHero = component.makeStoryNodes(46, null);

    const stepRows = data.STEP_META.map((item, index) => {
      const filled = storyNodesHeader[index].filled;
      return {
        key: item.key,
        label: item.label,
        subtitle: filled ? 'Done — tap to edit' : item.subtitle,
        onClick: () => component.goStep(index + 1),
        trailing: filled ? '✓' : '›',
        iconStyle: utils.shapeStyle(item.shape, 30).replace('TRIANGLECOLOR', `oklch(68% 0.12 ${item.hue})`) + (item.shape !== 'triangle' ? `background:${filled ? `oklch(68% 0.12 ${item.hue})` : 'oklch(93% 0.01 90)'};` : ''),
      };
    });

    const metaphorOptions = component.buildOptionCard([...data.METAPHORS, ...draft.custom.metaphor], draft.painMetaphor, 'painMetaphor', 280);
    const placeOptions = component.buildChipList([...data.PLACES, ...(draft.customPlaces || [])], draft.places, 'places', 230, true);
    const peopleOptions = component.buildChipList([...data.PEOPLE, ...(draft.customPeople || [])], draft.people, 'people', 230, true);
    const activeLensField = state.lensTab;
    const lensOptions = component.buildOptionCard(data.LENS_METAPHORS, draft[activeLensField], activeLensField, 165).map((option) => ({
      ...option,
      cardStyle: option.cardStyle.replace('height:112px;', 'height:64px;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;'),
    }));
    const lensTabRows = data.LENS_TABS.map((tab) => ({
      key: tab.key,
      label: tab.label,
      value: draft[tab.key] || 'Not chosen',
      onClick: () => component.setLensTab(tab.key),
      style: `cursor:pointer;flex:1;text-align:center;padding:11px 8px;border-radius:13px;font-size:13.5px;font-weight:600;background:${activeLensField === tab.key ? 'white' : 'transparent'};box-shadow:${activeLensField === tab.key ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'};color:${draft[tab.key] ? 'oklch(30% 0.02 280)' : 'oklch(55% 0.015 90)'};`,
    }));
    const lensPrompt = (data.LENS_TABS.find((tab) => tab.key === activeLensField) || data.LENS_TABS[0]).prompt;
    const approachOptions = component.buildOptionCard([...data.APPROACHES, ...draft.custom.approach], draft.approach, 'approach', 140);
    const handlingOptions = component.buildChipList(data.HANDLING, draft.handlingPractices, 'handlingPractices', 70, true);
    const handlingWorkedOptions = component.buildChipList(data.WORKED, draft.handlingWorked, 'handlingWorked', 70, false);
    const helpedOptions = component.buildChipList(data.HELPED, draft.handlingHelped, 'handlingHelped', 70, true);
    const missingOptions = component.buildChipList(data.MISSING, draft.handlingMissing, 'handlingMissing', 70, true);
    const nextPracticeOptions = component.buildChipList(data.NEXT_PRACTICES, draft.nextPractices, 'nextPractices', 30, true);
    const fromSelfOptions = component.buildChipList(data.FROM_SELF, draft.nextFromSelf, 'nextFromSelf', 30, true);
    const fromSupportersOptions = component.buildChipList(data.FROM_SUPPORTERS, draft.nextFromSupporters, 'nextFromSupporters', 30, true);
    const fromSystemsOptions = component.buildChipList(data.FROM_SYSTEMS, draft.nextFromSystems, 'nextFromSystems', 30, true);

    const addRowStyle = 'display:flex;gap:8px;';
    const addInputStyle = 'flex:1;border:1.5px solid oklch(88% 0.015 90);border-radius:12px;padding:11px 14px;font-size:14px;background:oklch(99% 0.004 90);outline:none;';
    const addButtonStyle = 'border:none;cursor:pointer;padding:11px 18px;border-radius:12px;background:oklch(88% 0.02 90);color:oklch(30% 0.02 280);font-weight:600;font-size:14px;';
    const textareaStyle = 'border:1.5px solid oklch(88% 0.015 90);border-radius:14px;padding:14px 16px;font-size:14.5px;background:oklch(99% 0.004 90);outline:none;resize:none;font-family:Karla,sans-serif;';

    const storyText = utils.buildSummaryClauses(draft).length
      ? utils.buildSummaryClauses(draft).join(' ')
      : 'This episode is still taking shape — every piece you add fills in more of the story.';

    const highlightTags = [];
    [...draft.handlingHelped, ...draft.nextFromSelf, ...draft.nextFromSupporters].slice(0, 3).forEach((tag, index) => {
      highlightTags.push({
        key: `${tag}${index}`,
        label: tag,
        style: `padding:9px 14px;border-radius:999px;font-size:13px;font-weight:500;background:oklch(93% 0.05 ${[70, 30, 140][index % 3]});color:oklch(32% 0.08 ${[70, 30, 140][index % 3]});`,
      });
    });

    const shareLabels = {
      pain: 'Pain metaphor',
      place: 'Place & people',
      lens: 'Self & others',
      approach: 'My approach',
      handled: 'How I handled it',
      next: 'Next care move',
    };
    const shareSectionRows = Object.keys(shareLabels).map((key) => ({
      key,
      label: shareLabels[key],
      onClick: () => component.toggleShareSection(key),
      checkStyle: `width:20px;height:20px;border-radius:7px;background:${state.shareSections[key] ? 'oklch(62% 0.11 280)' : 'oklch(96% 0.008 90)'};border:1.5px solid ${state.shareSections[key] ? 'oklch(62% 0.11 280)' : 'oklch(85% 0.015 90)'};`,
    }));

    return {
      screen,
      isHome: screen === 'home',
      isSetup: screen === 'setup',
      isOverview: screen === 'overview',
      isStepScreen,
      isStep1: stepNumber === 1,
      isStep2: stepNumber === 2,
      isStep3: stepNumber === 3,
      isStep4: stepNumber === 4,
      isStep5: stepNumber === 5,
      isStep6: stepNumber === 6,
      isComplete: screen === 'complete',
      isShare: screen === 'share',
      isPast: screen === 'past',
      isInsights: screen === 'insights',
      stepNumber,
      stepLabel: stepMeta.label,
      storyNodesMini,
      storyNodesHeader,
      storyNodesHero,
      stepRows,
      overviewCta: component.continueFlow ? (storyNodesHeader.some((node) => node.filled) ? 'Continue' : 'Begin Map') : 'Begin Map',
      metaphorOptions,
      addRowStyle,
      addInputStyle,
      addButtonStyle,
      textareaStyle,
      customDraftMetaphor: state.customDrafts.metaphor,
      onCustomChangeMetaphor: component.onCustomChangeMetaphor,
      onCustomAddMetaphor: component.onCustomAddMetaphor,
      painNote: draft.painNote,
      onPainNote: component.onPainNote,
      placeOptions,
      peopleOptions,
      placeNote: draft.placeNote,
      onPlaceNote: component.onPlaceNote,
      customDraftPlace: state.customDrafts.place,
      onCustomChangePlace: component.onCustomChangePlace,
      onCustomAddPlace: component.onCustomAddPlace,
      customDraftPerson: state.customDrafts.person,
      onCustomChangePerson: component.onCustomChangePerson,
      onCustomAddPerson: component.onCustomAddPerson,
      lensOptions,
      lensTabRows,
      lensPrompt,
      lensNote: draft.lensNote,
      onLensNote: component.onLensNote,
      approachOptions,
      customDraftApproach: state.customDrafts.approach,
      onCustomChangeApproach: component.onCustomChangeApproach,
      onCustomAddApproach: component.onCustomAddApproach,
      approachNote: draft.approachNote,
      onApproachNote: component.onApproachNote,
      handlingOptions,
      handlingWorkedOptions,
      helpedOptions,
      missingOptions,
      handlingNote: draft.handlingNote,
      onHandlingNote: component.onHandlingNote,
      nextPracticeOptions,
      fromSelfOptions,
      fromSupportersOptions,
      fromSystemsOptions,
      nextNote: draft.nextNote,
      onNextNote: component.onNextNote,
      stepBack: component.stepBack,
      stepSkip: component.stepSkip,
      stepPrimary: component.stepPrimary,
      stepPrimaryLabel: stepNumber >= 6 ? 'Complete Map' : 'Next',
      stepPrimaryStyle: `border:none;cursor:pointer;padding:14px 26px;border-radius:16px;background:${stepNumber >= 6 ? 'oklch(62% 0.1 30)' : 'oklch(62% 0.11 280)'};color:white;font-family:Quicksand,sans-serif;font-weight:600;font-size:15px;`,
      goOverview: component.goOverview,
      goComplete: component.goComplete,
      goShare: component.goShare,
      storyText,
      hasHighlights: highlightTags.length > 0,
      highlightTags,
      saveJourney: component.saveJourney,
      shareSectionRows,
      shareConfirmed: state.shareConfirmed,
      confirmShare: component.confirmShare,
    };
  }

  window.BWPages = window.BWPages || {};
  window.BWPages.flow = { buildFlowView };
})();
