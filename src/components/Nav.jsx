export default function Nav({ navOpen, onToggle, onNavigate, onStartNew, hasDraft }) {
  const items = [
    { key: 'home', label: 'Home', onClick: () => onNavigate('home') },
    { key: 'new', label: 'New Episode', onClick: onStartNew },
    ...(hasDraft ? [{ key: 'resume', label: 'Continue Draft', onClick: () => onNavigate('overview') }] : []),
    { key: 'past', label: 'Past Journeys', onClick: () => onNavigate('past') },
    { key: 'insights', label: 'Something to Reflect On', onClick: () => onNavigate('insights') },
  ];

  return (
    <div className="bw-nav">
      <button type="button" className="bw-nav__brand" onClick={() => onNavigate('home')}>
        <div className="bw-nav__dot" />
        <div className="bw-nav__title bw-quicksand">Beyond Words</div>
      </button>
      <div className="bw-nav__menu-wrap">
        <button type="button" className="bw-nav__menu-btn bw-quicksand" onClick={onToggle}>
          Menu <span className={`bw-nav__chevron${navOpen ? ' bw-nav__chevron--open' : ''}`}>⌄</span>
        </button>
        {navOpen && (
          <div className="bw-nav__menu">
            {items.map((item) => (
              <button key={item.key} type="button" className="bw-nav__item" onClick={item.onClick}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
