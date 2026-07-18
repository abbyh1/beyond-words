(function () {
  function buildHomeView(component) {
    const state = component.state;
    const draft = state.draft || window.BWUtils.blankDraft();
    const accent = component.props.accentColor || '#7C5CD6';
    const contentMaxWidth = component.props.layoutWidth === 'cozy' ? '640px' : '980px';
    const showNav = component.props.showQuickNav !== false;
    const primaryButtonStyle = `border:none;cursor:pointer;padding:16px;border-radius:20px;background:${accent};color:white;font-family:'Quicksand',sans-serif;font-weight:600;font-size:16.5px;box-shadow:0 10px 24px ${accent}55;max-width:360px;width:100%;align-self:center;`;
    const primaryButtonStyleAuto = primaryButtonStyle + 'margin-top:auto;';
    const navChevronStyle = `display:inline-block;transition:transform .2s ease;transform:rotate(${state.navOpen ? 180 : 0}deg);`;
    const navItemStyle = 'cursor:pointer;padding:12px 14px;border-radius:10px;font-size:14.5px;font-weight:500;color:oklch(30% 0.02 280);';
    const navMenuItems = [
      { key: 'home', label: 'Home', onClick: () => component.navTo('home') },
      { key: 'new', label: 'New Episode', onClick: component.navStartNew },
      ...(state.draft ? [{ key: 'resume', label: 'Continue Draft', onClick: () => component.navTo('overview') }] : []),
      { key: 'past', label: 'Past Journeys', onClick: () => component.navTo('past') },
      { key: 'insights', label: 'Something to Reflect On', onClick: () => component.navTo('insights') },
    ].map((item) => ({ ...item, style: navItemStyle }));

    const hour = new Date().getHours();
    const homeGreeting = hour < 12 ? 'Good morning.' : hour < 18 ? 'Good afternoon.' : 'Good evening.';

    return {
      accent,
      contentMaxWidth,
      showNav,
      primaryButtonStyle,
      primaryButtonStyleAuto,
      navChevronStyle,
      navMenuItems,
      homeGreeting,
      hasDraft: !!state.draft,
      draftTitleDisplay: draft.title || 'Untitled episode',
      startNewEpisode: component.startNewEpisode,
      resumeDraft: component.resumeDraft,
      goHome: component.goHome,
      goPast: component.goPast,
      goInsights: component.goInsights,
    };
  }

  window.BWPages = window.BWPages || {};
  window.BWPages.home = { buildHomeView };
})();
