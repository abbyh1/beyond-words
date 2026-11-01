import {
  STEP_META, METAPHORS, PLACES, PEOPLE, LENS_METAPHORS, LENS_TABS, APPROACHES,
  HANDLING, WORKED, HELPED, MISSING, NEXT_PRACTICES, FROM_SELF, FROM_SUPPORTERS, FROM_SYSTEMS,
} from '../data/content';
import OptionCard from './OptionCard';
import ChipList from './ChipList';
import StoryNodes from './StoryNodes';
import type {
  CustomDraftKind, CustomDrafts, Draft, LensField, MultiField, NoteField, SingleField,
} from '../types';

interface StepScreenProps {
  draft: Draft;
  stepNumber: number;
  activeStep: number;
  customDrafts: CustomDrafts;
  lensTab: LensField;
  onSetLensTab: (tab: LensField) => void;
  onBack: () => void;
  onSkip: () => void;
  onPrimary: () => void;
  onToggleSingle: (field: SingleField, value: string) => void;
  onToggleMulti: (field: MultiField, value: string) => void;
  onNoteChange: (field: NoteField, value: string) => void;
  onCustomDraftChange: (kind: CustomDraftKind, value: string) => void;
  onCustomAddMetaphor: () => void;
  onCustomAddPlace: () => void;
  onCustomAddPerson: () => void;
  onCustomAddApproach: () => void;
}

function Step1Pain({ draft, customDrafts, onToggleSingle, onNoteChange, onCustomDraftChange, onCustomAddMetaphor }: StepScreenProps) {
  return (
    <>
      <div className="bw-title-lg bw-quicksand">What did this pain feel like?</div>
      <div className="bw-subtitle--tight">Choose a metaphor that fits, or add your own.</div>
      <div className="bw-grid">
        {[...METAPHORS, ...draft.custom.metaphor].map((item) => (
          <OptionCard
            key={item.key}
            item={item}
            selected={draft.painMetaphor === item.label}
            onClick={() => onToggleSingle('painMetaphor', item.label)}
            hue={280}
            variant="card"
          />
        ))}
      </div>
      <div className="bw-add-row">
        <input
          className="bw-add-input"
          value={customDrafts.metaphor}
          onChange={(e) => onCustomDraftChange('metaphor', e.target.value)}
          placeholder="Add your own metaphor..."
        />
        <button type="button" className="bw-add-btn" onClick={onCustomAddMetaphor}>Add</button>
      </div>
      <label className="bw-field">
        <span className="bw-field__label">What does this metaphor mean to you?</span>
        <textarea
          className="bw-textarea"
          rows={3}
          value={draft.painNote}
          onChange={(e) => onNoteChange('painNote', e.target.value)}
          placeholder="Write a few words..."
        />
      </label>
    </>
  );
}

function Step2Place({ draft, customDrafts, onToggleMulti, onNoteChange, onCustomDraftChange, onCustomAddPlace, onCustomAddPerson }: StepScreenProps) {
  return (
    <>
      <div className="bw-title-lg bw-quicksand">Where did this happen, and who was around?</div>
      <div className="bw-section-label" style={{ marginTop: 0 }}>Where</div>
      <ChipList
        options={[...PLACES, ...(draft.customPlaces || [])]}
        selected={draft.places}
        onToggle={(value) => onToggleMulti('places', value)}
        hue={230}
      />
      <div className="bw-add-row">
        <input
          className="bw-add-input"
          value={customDrafts.place}
          onChange={(e) => onCustomDraftChange('place', e.target.value)}
          placeholder="Add your own place..."
        />
        <button type="button" className="bw-add-btn" onClick={onCustomAddPlace}>Add</button>
      </div>
      <div className="bw-section-label">
        Who was around <span className="bw-field__label-optional">(tap all that apply)</span>
      </div>
      <ChipList
        options={[...PEOPLE, ...(draft.customPeople || [])]}
        selected={draft.people}
        onToggle={(value) => onToggleMulti('people', value)}
        hue={230}
      />
      <div className="bw-add-row">
        <input
          className="bw-add-input"
          value={customDrafts.person}
          onChange={(e) => onCustomDraftChange('person', e.target.value)}
          placeholder="Add your own person..."
        />
        <button type="button" className="bw-add-btn" onClick={onCustomAddPerson}>Add</button>
      </div>
      <label className="bw-field bw-field--spaced">
        <span className="bw-field__label">
          Anything else about the setting? <span className="bw-field__label-optional">(optional)</span>
        </span>
        <textarea
          className="bw-textarea"
          rows={2}
          value={draft.placeNote}
          onChange={(e) => onNoteChange('placeNote', e.target.value)}
          placeholder="A short note, if you like..."
        />
      </label>
    </>
  );
}

function Step3Lens({ draft, lensTab, onSetLensTab, onToggleSingle, onNoteChange }: StepScreenProps) {
  const activeTab = LENS_TABS.find((tab) => tab.key === lensTab) || LENS_TABS[0];
  return (
    <>
      <div className="bw-title-lg bw-quicksand">Seeing through metaphors</div>
      <div className="bw-subtitle--tight">Switch between the three lenses below — the same metaphors apply to each.</div>
      <div className="bw-lens-tabs">
        {LENS_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className="bw-lens-tab"
            data-active={lensTab === tab.key}
            data-has-value={!!draft[tab.key]}
            onClick={() => onSetLensTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bw-lens-prompt">{activeTab.prompt}</div>
      <div className="bw-grid bw-grid--lens">
        {LENS_METAPHORS.map((item) => (
          <OptionCard
            key={item.key}
            item={item}
            selected={draft[lensTab] === item.label}
            onClick={() => onToggleSingle(lensTab, item.label)}
            hue={165}
            variant="compact"
          />
        ))}
      </div>
      <div className="bw-lens-summary">
        {LENS_TABS.map((tab) => (
          <div key={tab.key} className="bw-lens-summary__pill">
            {tab.label}: {draft[tab.key] || 'Not chosen'}
          </div>
        ))}
      </div>
      <label className="bw-field">
        <span className="bw-field__label">
          Anything to add? <span className="bw-field__label-optional">(optional)</span>
        </span>
        <textarea
          className="bw-textarea"
          rows={2}
          value={draft.lensNote}
          onChange={(e) => onNoteChange('lensNote', e.target.value)}
          placeholder="Write a few words..."
        />
      </label>
    </>
  );
}

function Step4Approach({ draft, customDrafts, onToggleSingle, onNoteChange, onCustomDraftChange, onCustomAddApproach }: StepScreenProps) {
  return (
    <>
      <div className="bw-title-lg bw-quicksand">What approach did you take?</div>
      <div className="bw-subtitle--tight">Choose the one that fits best, or add your own.</div>
      <div className="bw-grid bw-grid--approach">
        {[...APPROACHES, ...draft.custom.approach].map((item) => (
          <OptionCard
            key={item.key}
            item={item}
            selected={draft.approach === item.label}
            onClick={() => onToggleSingle('approach', item.label)}
            hue={140}
            variant="row"
          />
        ))}
      </div>
      <div className="bw-add-row">
        <input
          className="bw-add-input"
          value={customDrafts.approach}
          onChange={(e) => onCustomDraftChange('approach', e.target.value)}
          placeholder="Add your own approach..."
        />
        <button type="button" className="bw-add-btn" onClick={onCustomAddApproach}>Add</button>
      </div>
      <label className="bw-field">
        <span className="bw-field__label">
          Why does this approach fit? <span className="bw-field__label-optional">(optional)</span>
        </span>
        <textarea
          className="bw-textarea"
          rows={2}
          value={draft.approachNote}
          onChange={(e) => onNoteChange('approachNote', e.target.value)}
          placeholder="A few words..."
        />
      </label>
    </>
  );
}

function Step5Handling({ draft, onToggleSingle, onToggleMulti, onNoteChange }: StepScreenProps) {
  return (
    <>
      <div className="bw-title-lg bw-quicksand">How did you handle it?</div>
      <div className="bw-subtitle--tight">Pick the care practices you used.</div>
      <ChipList options={HANDLING} selected={draft.handlingPractices} onToggle={(v) => onToggleMulti('handlingPractices', v)} hue={70} />
      <div className="bw-section-label">Did this way of handling it work well?</div>
      <ChipList options={WORKED} selected={draft.handlingWorked} onToggle={(v) => onToggleSingle('handlingWorked', v)} hue={70} multi={false} />
      <div className="bw-section-label">What helped?</div>
      <ChipList options={HELPED} selected={draft.handlingHelped} onToggle={(v) => onToggleMulti('handlingHelped', v)} hue={70} />
      <div className="bw-section-label">What was missing?</div>
      <ChipList options={MISSING} selected={draft.handlingMissing} onToggle={(v) => onToggleMulti('handlingMissing', v)} hue={70} />
      <label className="bw-field">
        <span className="bw-field__label">
          Anything else? <span className="bw-field__label-optional">(optional)</span>
        </span>
        <textarea
          className="bw-textarea"
          rows={2}
          value={draft.handlingNote}
          onChange={(e) => onNoteChange('handlingNote', e.target.value)}
          placeholder="A few words..."
        />
      </label>
    </>
  );
}

function Step6Next({ draft, onToggleMulti, onNoteChange }: StepScreenProps) {
  return (
    <>
      <div className="bw-title-lg bw-quicksand">What might help next time?</div>
      <div className="bw-subtitle--tight">Choose care moves you may return to.</div>
      <ChipList options={NEXT_PRACTICES} selected={draft.nextPractices} onToggle={(v) => onToggleMulti('nextPractices', v)} hue={30} />
      <div className="bw-section-label">What would help — from yourself</div>
      <ChipList options={FROM_SELF} selected={draft.nextFromSelf} onToggle={(v) => onToggleMulti('nextFromSelf', v)} hue={30} />
      <div className="bw-section-label">From supporters</div>
      <ChipList options={FROM_SUPPORTERS} selected={draft.nextFromSupporters} onToggle={(v) => onToggleMulti('nextFromSupporters', v)} hue={30} />
      <div className="bw-section-label">From systems / society</div>
      <ChipList options={FROM_SYSTEMS} selected={draft.nextFromSystems} onToggle={(v) => onToggleMulti('nextFromSystems', v)} hue={30} />
      <label className="bw-field">
        <span className="bw-field__label">
          Anything else? <span className="bw-field__label-optional">(optional)</span>
        </span>
        <textarea
          className="bw-textarea"
          rows={2}
          value={draft.nextNote}
          onChange={(e) => onNoteChange('nextNote', e.target.value)}
          placeholder="A few words..."
        />
      </label>
    </>
  );
}

export default function StepScreen(props: StepScreenProps) {
  const { draft, stepNumber, activeStep, onBack, onSkip, onPrimary } = props;
  const stepMeta = STEP_META[stepNumber - 1] || STEP_META[0];

  return (
    <div className="bw-screen" style={{ animationDuration: '.35s' }}>
      <div className="bw-step-topbar">
        <button type="button" className="bw-back-btn" onClick={onBack}>←</button>
        <div className="bw-step-topbar__title bw-quicksand">Step {stepNumber} · {stepMeta.label}</div>
        <button type="button" className="bw-step-topbar__skip" onClick={onSkip}>Skip</button>
      </div>

      <div className="bw-progress-row">
        <StoryNodes draft={draft} size={30} variant="header" activeStep={activeStep} />
      </div>

      <div className="bw-step-body">
        {stepNumber === 1 && <Step1Pain {...props} />}
        {stepNumber === 2 && <Step2Place {...props} />}
        {stepNumber === 3 && <Step3Lens {...props} />}
        {stepNumber === 4 && <Step4Approach {...props} />}
        {stepNumber === 5 && <Step5Handling {...props} />}
        {stepNumber === 6 && <Step6Next {...props} />}
      </div>

      <div className="bw-bottom-bar">
        <button type="button" className="bw-bottom-bar__back" onClick={onBack}>Back</button>
        <div style={{ flex: 1 }} />
        <button
          type="button"
          className={`bw-step-primary bw-quicksand${stepNumber >= 6 ? ' bw-step-primary--final' : ''}`}
          onClick={onPrimary}
        >
          {stepNumber >= 6 ? 'Complete Map' : 'Next'}
        </button>
      </div>
    </div>
  );
}
