import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import ProgressBar from '../components/ProgressBar'
import CheckInNav from '../components/checkin/CheckInNav'
import Disclaimer from '../components/Disclaimer'
import { getCheckin } from '../data/quizzes'
import {
  patternCheckQuestions,
  getPatternQuestionQueue,
  checkPrompts,
  detectPatterns,
  suggestBalancedThought,
} from '../data/checkins/thought-challenger.js'

const FEELINGS = ['Anxious', 'Sad', 'Angry', 'Ashamed', 'Frustrated', 'Numb', 'Other']

const EMPTY_FORM = {
  whatHappened: '',
  thought: '',
  beliefBefore: 70,
  beliefBeforeEnabled: false,
  feeling: '',
  patternAnswers: {},
  selectedPrompt: null,
  checkResponse: '',
  balancedThought: '',
  beliefAfter: 50,
  beliefAfterRated: false,
}

const PATTERN_RESPONSES = [
  { id: 'yes', label: 'Yes' },
  { id: 'maybe', label: 'Maybe' },
  { id: 'no', label: 'No' },
  { id: 'not-sure', label: 'Not sure' },
]

export default function ThoughtChallengerPlay() {
  const { quizId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const checkin = getCheckin(quizId)

  const [step, setStep] = useState(1)
  const [patternIndex, setPatternIndex] = useState(0)
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    setForm(EMPTY_FORM)
    setStep(1)
    setPatternIndex(0)
  }, [quizId, location.key])

  const patternQueue = useMemo(
    () => (form.thought.trim() ? getPatternQuestionQueue(form.thought) : []),
    [form.thought]
  )

  const currentPatternQ =
    step === 2 && patternQueue[patternIndex]
      ? patternCheckQuestions.find((q) => q.id === patternQueue[patternIndex])
      : null

  useEffect(() => {
    if (typeof window.scrollTo === 'function') window.scrollTo({ top: 0 })
  }, [step, patternIndex])

  if (!checkin || checkin.type !== 'wizard') return <Navigate to="/" replace />

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function updatePattern(questionId, value) {
    setForm((prev) => ({
      ...prev,
      patternAnswers: { ...prev.patternAnswers, [questionId]: value },
    }))
  }

  function selectPrompt(promptId) {
    setForm((prev) => {
      if (
        prev.selectedPrompt &&
        prev.selectedPrompt !== promptId &&
        prev.checkResponse.trim() &&
        !window.confirm('Switching prompts will clear your current response. Continue?')
      ) {
        return prev
      }

      return {
        ...prev,
        selectedPrompt: promptId,
        checkResponse: prev.selectedPrompt === promptId ? prev.checkResponse : '',
      }
    })
  }

  function canProceed() {
    if (step === 1) return form.thought.trim().length > 0
    if (step === 2) return currentPatternQ ? !!form.patternAnswers[currentPatternQ.id] : true
    if (step === 3) return true
    if (step === 4) return form.balancedThought.trim().length > 0
    return false
  }

  function step3ButtonLabel() {
    if (!form.selectedPrompt) return 'Skip this step'
    return 'Continue'
  }

  function goNext() {
    if (step === 1) {
      setStep(2)
      setPatternIndex(0)
      return
    }

    if (step === 2) {
      if (patternIndex < patternQueue.length - 1) {
        setPatternIndex(patternIndex + 1)
      } else {
        setStep(3)
      }
      return
    }

    if (step === 3) {
      const { patterns } = detectPatterns(form.patternAnswers, patternQueue)
      if (!form.balancedThought) {
        update('balancedThought', suggestBalancedThought(patterns))
      }
      setStep(4)
      return
    }

    if (step === 4) {
      const { patterns } = detectPatterns(form.patternAnswers, patternQueue)
      const balancedThought =
        form.balancedThought || suggestBalancedThought(patterns)
      navigate(`/quiz/${checkin.id}/result/complete`, {
        replace: true,
        state: {
          ...form,
          balancedThought,
          patterns,
          beliefBefore: form.beliefBeforeEnabled ? form.beliefBefore : undefined,
          beliefBeforeRated: form.beliefBeforeEnabled,
          beliefAfter: form.beliefAfterRated ? form.beliefAfter : undefined,
        },
      })
    }
  }

  function goBack() {
    if (step === 1) {
      navigate(`/quiz/${checkin.id}`)
      return
    }
    if (step === 2 && patternIndex > 0) {
      setPatternIndex(patternIndex - 1)
      return
    }
    if (step === 2) {
      setStep(1)
      return
    }
    if (step === 3) {
      setStep(2)
      setPatternIndex(Math.max(0, patternQueue.length - 1))
      return
    }
    if (step === 4) {
      setStep(3)
    }
  }

  const selectedPrompt = checkPrompts.find((p) => p.id === form.selectedPrompt)

  return (
    <Layout hideFooter>
      <div className="animate-floatUp">
        <ProgressBar current={step} total={4} label="Step" />

        {step === 1 && (
          <section className="app-card">
            <h1 className="heading-md">The thought</h1>
            <p className="muted-text mt-2">Private — stays on your device. Nothing is sent anywhere.</p>
            <div className="form-fields mt-4">
              <FormField
                id="thought"
                label="What thought showed up?"
                value={form.thought}
                onChange={(v) => update('thought', v)}
                required
              />
              <FormField
                id="whatHappened"
                label="What happened? (optional)"
                value={form.whatHappened}
                onChange={(v) => update('whatHappened', v)}
              />
              <SelectField
                id="feeling"
                label="Feeling (optional)"
                value={form.feeling}
                onChange={(v) => update('feeling', v)}
                options={FEELINGS}
              />
              <fieldset className="form-field">
                <legend className="form-label mb-2">Belief strength (optional)</legend>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[14px]">
                    <input
                      type="radio"
                      name="beliefBeforeChoice"
                      checked={!form.beliefBeforeEnabled}
                      onChange={() => update('beliefBeforeEnabled', false)}
                    />
                    I’d rather not rate it
                  </label>
                  <label className="flex items-center gap-2 text-[14px]">
                    <input
                      type="radio"
                      name="beliefBeforeChoice"
                      checked={form.beliefBeforeEnabled}
                      onChange={() => update('beliefBeforeEnabled', true)}
                    />
                    Rate how true it feels ({form.beliefBefore}%)
                  </label>
                </div>
                {form.beliefBeforeEnabled && (
                  <input
                    id="beliefBefore"
                    type="range"
                    min="0"
                    max="100"
                    value={form.beliefBefore}
                    onChange={(e) => update('beliefBefore', Number(e.target.value))}
                    className="belief-slider mt-2"
                  />
                )}
              </fieldset>
            </div>
          </section>
        )}

        {step === 2 && currentPatternQ && (
          <section className="app-card">
            <h1 className="heading-md">What might your mind be doing?</h1>
            <p className="muted-text mt-2">
              Part {patternIndex + 1} of {patternQueue.length} · Step 2 of 4
            </p>
            <fieldset className="form-field mt-4">
              <legend className="form-label mb-2">{currentPatternQ.prompt}</legend>
              <div className="space-y-2">
                {PATTERN_RESPONSES.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={
                      form.patternAnswers[currentPatternQ.id] === opt.id ? 'true' : 'false'
                    }
                    onClick={() => updatePattern(currentPatternQ.id, opt.id)}
                    className={`option w-full ${
                      form.patternAnswers[currentPatternQ.id] === opt.id
                        ? 'option-selected'
                        : 'option-default'
                    }`}
                  >
                    <span
                      className={`option-radio ${
                        form.patternAnswers[currentPatternQ.id] === opt.id
                          ? 'option-radio-selected'
                          : 'option-radio-default'
                      }`}
                      aria-hidden="true"
                    />
                    {opt.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </section>
        )}

        {step === 3 && (
          <section className="app-card">
            <h1 className="heading-md">Choose one way to check it</h1>
            <p className="muted-text mt-2">Pick one prompt — or skip this step.</p>
            <div className="mt-4 space-y-2" role="radiogroup" aria-label="Check prompt">
              {checkPrompts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  role="radio"
                  aria-checked={form.selectedPrompt === p.id ? 'true' : 'false'}
                  onClick={() => selectPrompt(p.id)}
                  className={`option w-full ${
                    form.selectedPrompt === p.id ? 'option-selected' : 'option-default'
                  }`}
                >
                  <span
                    className={`option-radio ${
                      form.selectedPrompt === p.id ? 'option-radio-selected' : 'option-radio-default'
                    }`}
                    aria-hidden="true"
                  />
                  {p.label}
                </button>
              ))}
            </div>
            {selectedPrompt && selectedPrompt.id !== 'skip' && (
              <FormField
                id="checkResponse"
                label={`${selectedPrompt.label} (optional)`}
                value={form.checkResponse}
                onChange={(v) => update('checkResponse', v)}
                multiline
              />
            )}
          </section>
        )}

        {step === 4 && (
          <section className="app-card">
            <h1 className="heading-md">A fairer thought</h1>
            <p className="muted-text mt-2">
              Edit the starter below. A balanced thought does not pretend everything is fine.
            </p>
            <div className="form-fields mt-4">
              <FormField
                id="balancedThought"
                label="Your fairer thought"
                value={form.balancedThought}
                onChange={(v) => update('balancedThought', v)}
                multiline
                required
              />
              <fieldset className="form-field">
                <legend className="form-label mb-2">
                  How true does the original thought feel now? (optional)
                </legend>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[14px]">
                    <input
                      type="radio"
                      name="beliefAfterChoice"
                      checked={!form.beliefAfterRated}
                      onChange={() => update('beliefAfterRated', false)}
                    />
                    I’d rather not rate it
                  </label>
                  <label className="flex items-center gap-2 text-[14px]">
                    <input
                      type="radio"
                      name="beliefAfterChoice"
                      checked={form.beliefAfterRated}
                      onChange={() => update('beliefAfterRated', true)}
                    />
                    Rate it now ({form.beliefAfter}%)
                  </label>
                </div>
                {form.beliefAfterRated && (
                  <input
                    id="beliefAfter"
                    type="range"
                    min="0"
                    max="100"
                    value={form.beliefAfter}
                    onChange={(e) => update('beliefAfter', Number(e.target.value))}
                    className="belief-slider mt-2"
                  />
                )}
              </fieldset>
            </div>
          </section>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <button type="button" onClick={goNext} disabled={!canProceed()} className="btn-primary">
            {step === 4 ? 'See my result' : step === 3 ? step3ButtonLabel() : 'Next'}
          </button>
          <CheckInNav onBack={goBack} />
        </div>

        <Disclaimer className="mt-5" />
      </div>
    </Layout>
  )
}

function FormField({ id, label, value, onChange, required, multiline }) {
  const Tag = multiline ? 'textarea' : 'input'
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="text-purple"> *</span>}
      </label>
      <Tag
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
        rows={multiline ? 3 : undefined}
        autoComplete="off"
      />
    </div>
  )
}

function SelectField({ id, label, value, onChange, options }) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
      >
        <option value="">Choose one…</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  )
}
