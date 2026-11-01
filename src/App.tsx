import { useEffect, useRef, useState } from 'react';
import { blankDraft, stepFilledFlags } from './utils/draft';
import { buildShareText, downloadTextFile, shareFileName } from './utils/share';
import Nav from './components/Nav';
import Toast from './components/Toast';
import Home from './components/Home';
import Setup from './components/Setup';
import Overview from './components/Overview';
import StepScreen from './components/StepScreen';
import Complete from './components/Complete';
import Share from './components/Share';
import Past from './components/Past';
import Insights from './components/Insights';
import type {
  CustomDraftKind, CustomDrafts, Draft, Journey, LensField, MultiField, PastView, Screen,
  ShareKey, ShareSections, SingleField,
} from './types';

const STEP_SCREEN = /^step[1-6]$/;

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [draft, setDraft] = useState<Draft | null>(null);
  const [pastJourneys, setPastJourneys] = useState<Journey[]>([]);
  const [pastView, setPastView] = useState<PastView>('list');
  const [activeStep, setActiveStep] = useState(1);
  const [customDrafts, setCustomDrafts] = useState<CustomDrafts>({ metaphor: '', approach: '', place: '', person: '' });
  const [lensTab, setLensTab] = useState<LensField>('selfLens');
  const [shareSections, setShareSections] = useState<ShareSections>({
    pain: true, place: true, lens: true, approach: true, handled: true, next: true,
  });
  const [shareResult, setShareResult] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem('bw_draft');
      const rawPast = localStorage.getItem('bw_past');
      if (rawDraft) setDraft(JSON.parse(rawDraft) as Draft);
      if (rawPast) setPastJourneys(JSON.parse(rawPast) as Journey[]);
    } catch (error) {
      console.warn('Could not load saved draft', error);
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      draft ? localStorage.setItem('bw_draft', JSON.stringify(draft)) : localStorage.removeItem('bw_draft');
    } catch (error) {
      console.warn('Could not persist draft', error);
    }
  }, [draft]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem('bw_past', JSON.stringify(pastJourneys));
    } catch (error) {
      console.warn('Could not persist journeys', error);
    }
  }, [pastJourneys]);

  function flashToast(message: string) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  }

  function go(next: Screen) {
    setScreen(next);
  }

  function navTo(next: Screen) {
    setNavOpen(false);
    go(next);
  }

  function startNewEpisode() {
    setDraft(blankDraft());
    setScreen('setup');
  }

  function updateDraft(patch: Partial<Draft>) {
    setDraft((d) => ({ ...(d ?? blankDraft()), ...patch }));
  }

  function goStep(step: number) {
    setActiveStep(step);
    setScreen(`step${step}` as Screen);
  }

  function continueFlow() {
    const filled = stepFilledFlags(draft);
    const firstIncomplete = filled.findIndex((value) => !value);
    goStep(firstIncomplete === -1 ? 1 : firstIncomplete + 1);
  }

  function stepBack() {
    if (activeStep <= 1) go('overview');
    else goStep(activeStep - 1);
  }

  function stepSkip() {
    if (activeStep >= 6) go('complete');
    else goStep(activeStep + 1);
  }

  function stepPrimary() {
    if (activeStep >= 6) go('complete');
    else goStep(activeStep + 1);
  }

  function toggleSingle(field: SingleField, value: string) {
    setDraft((prev) => {
      const d = prev ?? blankDraft();
      return { ...d, [field]: d[field] === value ? null : value };
    });
  }

  function toggleMulti(field: MultiField, value: string) {
    setDraft((prev) => {
      const d = prev ?? blankDraft();
      const arr = d[field];
      const next = arr.includes(value) ? arr.filter((entry) => entry !== value) : [...arr, value];
      return { ...d, [field]: next };
    });
  }

  function onCustomDraftChange(kind: CustomDraftKind, value: string) {
    setCustomDrafts((c) => ({ ...c, [kind]: value }));
  }

  function onCustomAddMetaphor() {
    const value = customDrafts.metaphor.trim();
    if (!value || !draft) return;
    updateDraft({
      custom: { ...draft.custom, metaphor: [...draft.custom.metaphor, { key: `c_${Date.now()}`, label: value, desc: 'Your own words' }] },
      painMetaphor: value,
    });
    onCustomDraftChange('metaphor', '');
  }

  function onCustomAddPlace() {
    const value = customDrafts.place.trim();
    if (!value || !draft) return;
    updateDraft({ customPlaces: [...(draft.customPlaces || []), value], places: [...draft.places, value] });
    onCustomDraftChange('place', '');
  }

  function onCustomAddPerson() {
    const value = customDrafts.person.trim();
    if (!value || !draft) return;
    updateDraft({ customPeople: [...(draft.customPeople || []), value], people: [...draft.people, value] });
    onCustomDraftChange('person', '');
  }

  function onCustomAddApproach() {
    const value = customDrafts.approach.trim();
    if (!value || !draft) return;
    updateDraft({
      custom: { ...draft.custom, approach: [...draft.custom.approach, { key: `c_${Date.now()}`, label: value, desc: 'Your own words' }] },
      approach: value,
    });
    onCustomDraftChange('approach', '');
  }

  function saveJourney() {
    if (!draft) return;
    const saved = { ...draft, id: `j_${Date.now()}`, savedAt: Date.now() };
    setPastJourneys((list) => [saved, ...list]);
    setDraft(null);
    go('home');
    flashToast('Saved to your journeys');
  }

  function toggleShareSection(key: ShareKey) {
    setShareSections((s) => ({ ...s, [key]: !s[key] }));
  }

  async function confirmShare() {
    if (!draft) return;
    const text = buildShareText(draft, shareSections);

    if (navigator.share) {
      try {
        await navigator.share({ title: draft.title || 'My Pain Episode', text });
        setShareResult('Shared.');
        flashToast('Shared');
        return;
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        // fall through to clipboard/download below
      }
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        setShareResult("Copied to your clipboard — paste it wherever you'd like.");
        flashToast('Copied to clipboard');
        return;
      } catch {
        // fall through to download below
      }
    }

    downloadTextFile(shareFileName(draft), text);
    setShareResult('Downloaded as a text file.');
    flashToast('Downloaded as a text file');
  }

  const isStepScreen = STEP_SCREEN.test(screen);
  const stepNumber = isStepScreen ? parseInt(screen.replace('step', ''), 10) : activeStep;
  const activeDraft = draft || blankDraft();

  return (
    <div className="bw-shell">
      <div className="bw-shell__inner">
        <Nav
          navOpen={navOpen}
          onToggle={() => setNavOpen((v) => !v)}
          onNavigate={navTo}
          onStartNew={() => { setNavOpen(false); startNewEpisode(); }}
          hasDraft={!!draft}
        />

        <div className="bw-container">
          {screen === 'home' && (
            <Home
              draft={draft}
              onResume={() => go('overview')}
              onStartNew={startNewEpisode}
              onGoPast={() => go('past')}
              onGoInsights={() => go('insights')}
            />
          )}

          {screen === 'setup' && (
            <Setup
              draft={activeDraft}
              onBack={() => go('home')}
              onTitleChange={(value) => updateDraft({ title: value })}
              onContextChange={(value) => updateDraft({ context: value })}
              onTimeOfDay={(value) => updateDraft({ timeOfDay: value })}
              onBegin={() => go('overview')}
            />
          )}

          {screen === 'overview' && (
            <Overview
              draft={activeDraft}
              activeStep={activeStep}
              onBack={() => go('home')}
              onStepClick={goStep}
              onContinue={continueFlow}
            />
          )}

          {isStepScreen && (
            <StepScreen
              draft={activeDraft}
              stepNumber={stepNumber}
              activeStep={activeStep}
              customDrafts={customDrafts}
              lensTab={lensTab}
              onSetLensTab={setLensTab}
              onBack={stepBack}
              onSkip={stepSkip}
              onPrimary={stepPrimary}
              onToggleSingle={toggleSingle}
              onToggleMulti={toggleMulti}
              onNoteChange={(field, value) => updateDraft({ [field]: value })}
              onCustomDraftChange={onCustomDraftChange}
              onCustomAddMetaphor={onCustomAddMetaphor}
              onCustomAddPlace={onCustomAddPlace}
              onCustomAddPerson={onCustomAddPerson}
              onCustomAddApproach={onCustomAddApproach}
            />
          )}

          {screen === 'complete' && (
            <Complete
              draft={activeDraft}
              onBack={() => go('overview')}
              onSave={saveJourney}
              onShare={() => { setShareResult(null); go('share'); }}
            />
          )}

          {screen === 'share' && (
            <Share
              shareSections={shareSections}
              shareResult={shareResult}
              onBack={() => go('complete')}
              onToggleSection={toggleShareSection}
              onConfirm={confirmShare}
            />
          )}

          {screen === 'past' && (
            <Past
              pastJourneys={pastJourneys}
              pastView={pastView}
              onSetList={() => setPastView('list')}
              onSetConstellation={() => setPastView('constellation')}
              onBack={() => go('home')}
              onStartNew={startNewEpisode}
            />
          )}

          {screen === 'insights' && (
            <Insights pastJourneys={pastJourneys} onBack={() => go('home')} onStartNew={startNewEpisode} />
          )}
        </div>

        <Toast message={toast} />
      </div>
    </div>
  );
}
