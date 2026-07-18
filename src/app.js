(function () {
  const data = window.BWData || {};
  const utils = window.BWUtils || {};
  const pages = window.BWPages || {};

  function blankDraft() {
    return utils.blankDraft ? utils.blankDraft() : {
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

  function createComponent(DCLogic) {
    return class Component extends DCLogic {
    state = {
      screen: 'home',
      draft: null,
      pastJourneys: [],
      pastView: 'list',
      activeStep: 1,
      customDrafts: { metaphor: '', approach: '', place: '', person: '' },
      hoveredOption: null,
      lensTab: 'selfLens',
      shareSections: { pain: true, place: true, lens: true, approach: true, handled: true, next: true },
      shareConfirmed: false,
      toast: '',
      navOpen: false,
    };

    toggleNav = () => this.setState((state) => ({ navOpen: !state.navOpen }));
    closeNav = () => this.setState({ navOpen: false });
    navTo(screen) { this.closeNav(); this.go(screen); }
    navStartNew = () => { this.closeNav(); this.startNewEpisode(); };

    componentDidMount() {
      try {
        const rawDraft = localStorage.getItem('bw_draft');
        const rawPast = localStorage.getItem('bw_past');
        this.setState({
          draft: rawDraft ? JSON.parse(rawDraft) : null,
          pastJourneys: rawPast ? JSON.parse(rawPast) : [],
        });
      } catch (error) {
        console.warn('Could not load saved draft', error);
      }
    }

    componentDidUpdate(prevProps, prevState) {
      const nextDraft = this.state?.draft;
      const prevDraft = prevState?.draft;
      if (prevDraft !== nextDraft) {
        try {
          nextDraft ? localStorage.setItem('bw_draft', JSON.stringify(nextDraft)) : localStorage.removeItem('bw_draft');
        } catch (error) {
          console.warn('Could not persist draft', error);
        }
      }

      const nextPastJourneys = this.state?.pastJourneys;
      const prevPastJourneys = prevState?.pastJourneys;
      if (prevPastJourneys !== nextPastJourneys) {
        try {
          localStorage.setItem('bw_past', JSON.stringify(nextPastJourneys || []));
        } catch (error) {
          console.warn('Could not persist journeys', error);
        }
      }
    }

    flashToast(msg) {
      this.setState({ toast: msg });
      clearTimeout(this._toastTimer);
      this._toastTimer = setTimeout(() => this.setState({ toast: '' }), 1800);
    }

    go(screen) { this.setState({ screen }); }
    goHome = () => this.go('home');
    goPast = () => this.go('past');
    goInsights = () => this.go('insights');
    goOverview = () => this.go('overview');
    goComplete = () => this.go('complete');
    goShare = () => this.go('share');

    startNewEpisode = () => { this.setState({ draft: blankDraft(), screen: 'setup' }); };
    resumeDraft = () => { this.go(this.state.draft && this.state.draft.completedAt ? 'overview' : 'overview'); };

    updateDraft(patch) { this.setState((state) => ({ draft: { ...state.draft, ...patch } })); }

    onSetupTitle = (event) => this.updateDraft({ title: event.target.value });
    onSetupContext = (event) => this.updateDraft({ context: event.target.value });
    setTimeOfDay = (value) => this.updateDraft({ timeOfDay: value });
    beginMap = () => this.go('overview');

    goStep = (step) => { this.setState({ activeStep: step, screen: `step${step}` }); };
    continueFlow = () => {
      const draft = this.state.draft;
      const order = [
        !!(draft && draft.painMetaphor),
        !!(draft && (draft.places.length || draft.people.length)),
        !!(draft && (draft.selfLens || draft.supportersLens || draft.societyLens)),
        !!(draft && draft.approach),
        !!(draft && draft.handlingPractices.length),
        !!(draft && draft.nextPractices.length),
      ];
      const firstIncomplete = order.findIndex((value) => !value);
      this.goStep(firstIncomplete === -1 ? 1 : firstIncomplete + 1);
    };

    stepBack = () => {
      const step = this.state.activeStep;
      if (step <= 1) this.go('overview'); else this.goStep(step - 1);
    };
    stepSkip = () => {
      const step = this.state.activeStep;
      if (step >= 6) this.go('complete'); else this.goStep(step + 1);
    };
    stepPrimary = () => {
      const step = this.state.activeStep;
      if (step >= 6) this.go('complete'); else this.goStep(step + 1);
    };

    toggleSingle(field, value) { this.updateDraft({ [field]: this.state.draft[field] === value ? null : value }); }
    toggleMulti(field, value) {
      const arr = this.state.draft[field];
      const next = arr.includes(value) ? arr.filter((entry) => entry !== value) : [...arr, value];
      this.updateDraft({ [field]: next });
    }

    onPainNote = (event) => this.updateDraft({ painNote: event.target.value });
    onPlaceNote = (event) => this.updateDraft({ placeNote: event.target.value });
    onLensNote = (event) => this.updateDraft({ lensNote: event.target.value });
    onApproachNote = (event) => this.updateDraft({ approachNote: event.target.value });
    onHandlingNote = (event) => this.updateDraft({ handlingNote: event.target.value });
    onNextNote = (event) => this.updateDraft({ nextNote: event.target.value });

    onCustomChangeMetaphor = (event) => this.setState((state) => ({ customDrafts: { ...state.customDrafts, metaphor: event.target.value } }));
    onCustomAddMetaphor = () => {
      const value = this.state.customDrafts.metaphor.trim();
      if (!value) return;
      const draft = this.state.draft;
      this.updateDraft({ custom: { ...draft.custom, metaphor: [...draft.custom.metaphor, { key: `c_${Date.now()}`, label: value, desc: 'Your own words' }] }, painMetaphor: value });
      this.setState((state) => ({ customDrafts: { ...state.customDrafts, metaphor: '' } }));
    };
    onCustomChangePlace = (event) => this.setState((state) => ({ customDrafts: { ...state.customDrafts, place: event.target.value } }));
    onCustomAddPlace = () => {
      const value = this.state.customDrafts.place.trim();
      if (!value) return;
      const draft = this.state.draft;
      this.updateDraft({ customPlaces: [...(draft.customPlaces || []), value], places: [...draft.places, value] });
      this.setState((state) => ({ customDrafts: { ...state.customDrafts, place: '' } }));
    };
    onCustomChangePerson = (event) => this.setState((state) => ({ customDrafts: { ...state.customDrafts, person: event.target.value } }));
    onCustomAddPerson = () => {
      const value = this.state.customDrafts.person.trim();
      if (!value) return;
      const draft = this.state.draft;
      this.updateDraft({ customPeople: [...(draft.customPeople || []), value], people: [...draft.people, value] });
      this.setState((state) => ({ customDrafts: { ...state.customDrafts, person: '' } }));
    };
    onCustomChangeApproach = (event) => this.setState((state) => ({ customDrafts: { ...state.customDrafts, approach: event.target.value } }));
    onCustomAddApproach = () => {
      const value = this.state.customDrafts.approach.trim();
      if (!value) return;
      const draft = this.state.draft;
      this.updateDraft({ custom: { ...draft.custom, approach: [...draft.custom.approach, { key: `c_${Date.now()}`, label: value, desc: 'Your own words' }] }, approach: value });
      this.setState((state) => ({ customDrafts: { ...state.customDrafts, approach: '' } }));
    };

    saveJourney = () => {
      const draft = this.state.draft;
      const saved = { ...draft, id: `j_${Date.now()}`, savedAt: Date.now() };
      this.setState((state) => ({ pastJourneys: [saved, ...state.pastJourneys], draft: null, screen: 'home' }));
      this.flashToast('Saved to your journeys');
    };

    setLensTab = (key) => this.setState({ lensTab: key });
    setPastList = () => this.setState({ pastView: 'list' });
    setPastConstellation = () => this.setState({ pastView: 'constellation' });
    toggleShareSection = (key) => this.setState((state) => ({ shareSections: { ...state.shareSections, [key]: !state.shareSections[key] } }));
    confirmShare = () => { this.setState({ shareConfirmed: true }); this.flashToast('Preview ready — nothing was sent'); };
    setHovered = (key) => this.setState({ hoveredOption: key });
    clearHovered = (key) => this.setState((state) => (state.hoveredOption === key ? { hoveredOption: null } : null));

    buildOptionCard(list, selectedValue, field, hue) {
      return utils.buildOptionCard(this, list, selectedValue, field, hue);
    }

    buildChipList(list, selected, field, hue, multi) {
      return utils.buildChipList(this, list, selected, field, hue, multi);
    }

    makeStoryNodes(size, ringHue) {
      return utils.makeStoryNodes(this, size, ringHue);
    }

    renderVals() {
      const state = this.state;
      const draft = state.draft || blankDraft();
      const screen = state.screen;
      const homeView = pages.home?.buildHomeView(this) || {};
      const flowView = pages.flow?.buildFlowView(this) || {};
      const journeysView = pages.journeys?.buildJourneysView(this) || {};

      return {
        ...homeView,
        ...flowView,
        ...journeysView,
        draftTitleDisplay: draft.title || 'Untitled episode',
        draftDateDisplay: new Date(draft.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) + (draft.timeOfDay ? ` · ${draft.timeOfDay}` : ''),
        setupTitle: draft.title,
        setupContext: draft.context,
        onSetupTitle: this.onSetupTitle,
        onSetupContext: this.onSetupContext,
        timeOfDayOptions: ['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => ({
          key: time,
          label: time,
          onClick: () => this.setTimeOfDay(time),
          style: `cursor:pointer;padding:10px 16px;border-radius:999px;font-size:14px;font-weight:500;background:${draft.timeOfDay === time ? 'oklch(62% 0.11 280)' : 'oklch(99% 0.004 90)'};color:${draft.timeOfDay === time ? 'white' : 'oklch(32% 0.02 280)'};border:1.5px solid ${draft.timeOfDay === time ? 'oklch(62% 0.11 280)' : 'oklch(88% 0.012 90)'};`,
        })),
        beginMap: this.beginMap,
        screen,
        hasDraft: !!state.draft,
        setupTitle: draft.title,
        startNewEpisode: this.startNewEpisode,
        resumeDraft: this.resumeDraft,
        goHome: this.goHome,
        goPast: this.goPast,
        goInsights: this.goInsights,
        goOverview: this.goOverview,
        goComplete: this.goComplete,
        goShare: this.goShare,
        toggleNav: this.toggleNav,
        navOpen: state.navOpen,
        navChevronStyle: `display:inline-block;transition:transform .2s ease;transform:rotate(${state.navOpen ? 180 : 0}deg);`,
        navMenuItems: [
          { key: 'home', label: 'Home', onClick: () => this.navTo('home') },
          { key: 'new', label: 'New Episode', onClick: this.navStartNew },
          ...(state.draft ? [{ key: 'resume', label: 'Continue Draft', onClick: () => this.navTo('overview') }] : []),
          { key: 'past', label: 'Past Journeys', onClick: () => this.navTo('past') },
          { key: 'insights', label: 'Something to Reflect On', onClick: () => this.navTo('insights') },
        ].map((item) => ({ ...item, style: 'cursor:pointer;padding:12px 14px;border-radius:10px;font-size:14.5px;font-weight:500;color:oklch(30% 0.02 280);' })),
        toast: state.toast,
        showNav: this.props.showQuickNav !== false,
        contentMaxWidth: this.props.layoutWidth === 'cozy' ? '640px' : '980px',
        accent: this.props.accentColor || '#7C5CD6',
        primaryButtonStyle: `border:none;cursor:pointer;padding:16px;border-radius:20px;background:${this.props.accentColor || '#7C5CD6'};color:white;font-family:'Quicksand',sans-serif;font-weight:600;font-size:16.5px;box-shadow:0 10px 24px ${this.props.accentColor || '#7C5CD6'}55;max-width:360px;width:100%;align-self:center;`,
        primaryButtonStyleAuto: `border:none;cursor:pointer;padding:16px;border-radius:20px;background:${this.props.accentColor || '#7C5CD6'};color:white;font-family:'Quicksand',sans-serif;font-weight:600;font-size:16.5px;box-shadow:0 10px 24px ${this.props.accentColor || '#7C5CD6'}55;max-width:360px;width:100%;align-self:center;margin-top:auto;`,
        stepBack: this.stepBack,
        stepSkip: this.stepSkip,
        stepPrimary: this.stepPrimary,
        stepPrimaryLabel: state.activeStep >= 6 ? 'Complete Map' : 'Next',
        stepPrimaryStyle: `border:none;cursor:pointer;padding:14px 26px;border-radius:16px;background:${state.activeStep >= 6 ? 'oklch(62% 0.1 30)' : 'oklch(62% 0.11 280)'};color:white;font-family:Quicksand,sans-serif;font-weight:600;font-size:15px;`,
        saveJourney: this.saveJourney,
        confirmShare: this.confirmShare,
        shareConfirmed: state.shareConfirmed,
        pastListTabStyle: `flex:1;text-align:center;padding:9px;border-radius:11px;cursor:pointer;font-size:13.5px;font-weight:600;background:${state.pastView === 'list' ? 'white' : 'transparent'};box-shadow:${state.pastView === 'list' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'};`,
        pastConstellationTabStyle: `flex:1;text-align:center;padding:9px;border-radius:11px;cursor:pointer;font-size:13.5px;font-weight:600;background:${state.pastView === 'constellation' ? 'white' : 'transparent'};box-shadow:${state.pastView === 'constellation' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'};`,
        setPastList: this.setPastList,
        setPastConstellation: this.setPastConstellation,
      };
    }
    };
  }

  window.BWApp = window.BWApp || {};
  window.BWApp.createComponent = createComponent;
})();
