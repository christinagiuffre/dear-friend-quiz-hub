import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams, Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import ProgressBar from '../components/ProgressBar'
import AnswerCard from '../components/checkin/AnswerCard'
import CheckInNav from '../components/checkin/CheckInNav'
import { getCheckin } from '../data/quizzes'
import {
  getCurrentQuestionId,
  getProgress,
  isQuizComplete,
  findOption,
  findQuestion,
} from '../lib/quizFlow'
import {
  createSession,
  setSelectedAnswerId,
  commitAnswer,
  goBackOneQuestion,
  canGoNext,
  toggleMultiSelect,
  setCompoundLimits,
  resetSession,
} from '../lib/quizSession'
import { scoreQuiz, scoreWeightedQuiz } from '../lib/scoring'
import { buildBoredomProfile } from '../lib/boredom'
import { validateQuizSession } from '../lib/validateQuizSession'

export default function CheckInPlay() {
  const { quizId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const checkin = getCheckin(quizId)

  const [session, setSession] = useState(() => createSession(quizId))
  const [multiMessage, setMultiMessage] = useState('')

  const isPlayable = checkin && checkin.type !== 'wizard'
  const currentQuestionId = isPlayable
    ? getCurrentQuestionId(checkin, session.answersByQuestionId)
    : null

  useEffect(() => {
    setSession(resetSession(quizId))
    setMultiMessage('')
  }, [quizId, location.key, location.search])

  useEffect(() => {
    if (currentQuestionId) window.scrollTo({ top: 0 })
  }, [currentQuestionId])

  if (!checkin) return <Navigate to="/" replace />
  if (checkin.type === 'wizard') return <Navigate to={`/quiz/${checkin.id}/reflect`} replace />

  const question = findQuestion(checkin, currentQuestionId)
  if (!question) return <Navigate to={`/quiz/${checkin.id}`} replace />

  const progress = getProgress(checkin, session.answersByQuestionId, currentQuestionId)
  const questionType = question.questionType || 'single'
  const selectedRaw = session.selectedAnswerIdByQuestionId[currentQuestionId] ?? null
  const validationError = location.state?.validationError

  function selectSingle(option) {
    setSession((s) => setSelectedAnswerId(s, currentQuestionId, option.id))
  }

  function selectMulti(option) {
    const current = session.selectedAnswerIdByQuestionId[currentQuestionId]
    const ids = Array.isArray(current) ? current : []
    const max = question.maxSelect || 2

    if (ids.length >= max && !ids.includes(option.id) && option.id !== 'crave-unsure') {
      setMultiMessage(`You can pick up to ${max}. Deselect one to choose another.`)
      return
    }

    setMultiMessage('')
    setSession((s) => toggleMultiSelect(s, currentQuestionId, option.id, max))
  }

  function selectCompound(field, optionId) {
    setSession((s) => setCompoundLimits(s, currentQuestionId, field, optionId))
  }

  function goNext() {
    if (!canGoNext(session, currentQuestionId, questionType)) return

    let nextSession = session

    if (questionType === 'compound') {
      const sel = session.selectedAnswerIdByQuestionId[currentQuestionId]
      nextSession = {
        ...session,
        answersByQuestionId: {
          ...session.answersByQuestionId,
          [currentQuestionId]: { id: currentQuestionId, time: sel.time, budget: sel.budget },
        },
      }
    } else {
      nextSession = commitAnswer(session, checkin, currentQuestionId, findOption)
    }

    const answer = nextSession.answersByQuestionId[currentQuestionId]
    if (answer?.shortCircuit) {
      finishCheckin(nextSession.answersByQuestionId)
      return
    }

    if (isQuizComplete(checkin, nextSession.answersByQuestionId)) {
      finishCheckin(nextSession.answersByQuestionId)
    } else {
      const nextQId = getCurrentQuestionId(checkin, nextSession.answersByQuestionId)
      setSession({
        ...nextSession,
        selectedAnswerIdByQuestionId: {
          ...nextSession.selectedAnswerIdByQuestionId,
          [nextQId]: null,
        },
      })
    }
  }

  function finishCheckin(answersByQuestionId) {
    const validation = validateQuizSession({ quizId: checkin.id, answersByQuestionId })
    if (!validation.valid) {
      navigate(`/quiz/${checkin.id}/play`, {
        replace: true,
        state: { validationError: validation.message },
      })
      return
    }

    if (checkin.type === 'boredom') {
      const profile = buildBoredomProfile(answersByQuestionId)
      if (!profile) {
        navigate(`/quiz/${checkin.id}/play`, {
          replace: true,
          state: { validationError: 'Please complete every screen before viewing suggestions.' },
        })
        return
      }
      navigate(`/quiz/${checkin.id}/result/suggestions`, {
        replace: true,
        state: { answersByQuestionId, history: [] },
      })
      return
    }

    if (checkin.type === 'weighted') {
      const scored = scoreWeightedQuiz(checkin, answersByQuestionId)
      navigate(`/quiz/${checkin.id}/result/${scored.resultId.toLowerCase()}`, {
        replace: true,
        state: { ...scored, answersByQuestionId },
      })
      return
    }

    const scored = scoreQuiz(checkin, answersByQuestionId)
    navigate(`/quiz/${checkin.id}/result/${scored.resultId.toLowerCase()}`, {
      replace: true,
      state: { ...scored, answersByQuestionId },
    })
  }

  function goBack() {
    if (!Object.keys(session.answersByQuestionId).length) {
      navigate(`/quiz/${checkin.id}`)
      return
    }
    setSession((s) => goBackOneQuestion(s, checkin))
  }

  const playful = checkin.playful

  return (
    <Layout hideFooter>
      <div className={`animate-floatUp ${playful ? 'boredom-play' : ''}`}>
        <ProgressBar
          current={progress.current}
          total={progress.total}
          label="Question"
        />

        {validationError && (
          <p className="note-box mb-4 text-left" role="alert">
            {validationError}
          </p>
        )}

        <section className={`app-card ${playful ? 'boredom-card' : ''}`}>
          <h1 className="heading-md">{question.prompt}</h1>
          <p className="muted-text mt-2">
            {questionType === 'multi'
              ? `Pick up to ${question.maxSelect || 2}.`
              : 'Pick whichever feels closest. No wrong answers.'}
          </p>

          {questionType === 'compound' ? (
            <CompoundQuestion
              question={question}
              selected={selectedRaw || {}}
              onSelect={selectCompound}
            />
          ) : (
            <div className="mt-4 space-y-2" role="radiogroup" aria-label={question.prompt}>
              {question.options.map((option) => {
                const isSelected =
                  questionType === 'multi'
                    ? Array.isArray(selectedRaw) && selectedRaw.includes(option.id)
                    : selectedRaw === option.id
                return (
                  <AnswerCard
                    key={`${currentQuestionId}-${option.id}`}
                    option={option}
                    selected={isSelected}
                    onSelect={questionType === 'multi' ? selectMulti : selectSingle}
                    name={currentQuestionId}
                  />
                )
              })}
            </div>
          )}

          {multiMessage && (
            <p className="mt-3 text-[13px] font-medium text-purple" role="status">
              {multiMessage}
            </p>
          )}
        </section>

        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={goNext}
            disabled={!canGoNext(session, currentQuestionId, questionType)}
            className="btn-primary"
          >
            {progress.current >= progress.total ? 'See my result' : 'Next'}
          </button>
          <CheckInNav onBack={goBack} />
        </div>
      </div>
    </Layout>
  )
}

function CompoundQuestion({ question, selected, onSelect }) {
  const { time, budget } = question.options
  return (
    <div className="form-fields mt-4">
      <fieldset className="form-field">
        <legend className="form-label mb-2">Time</legend>
        <div className="space-y-2">
          {time.map((opt) => (
            <AnswerCard
              key={opt.id}
              option={opt}
              selected={selected.time === opt.id}
              onSelect={() => onSelect('time', opt.id)}
              name={`${question.id}-time`}
            />
          ))}
        </div>
      </fieldset>
      <fieldset className="form-field mt-4">
        <legend className="form-label mb-2">Budget</legend>
        <div className="space-y-2">
          {budget.map((opt) => (
            <AnswerCard
              key={opt.id}
              option={opt}
              selected={selected.budget === opt.id}
              onSelect={() => onSelect('budget', opt.id)}
              name={`${question.id}-budget`}
            />
          ))}
        </div>
      </fieldset>
    </div>
  )
}
