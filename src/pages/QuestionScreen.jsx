import { useEffect, useState } from 'react'
import { useNavigate, useParams, Navigate, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import ProgressBar from '../components/ProgressBar'
import { getQuiz } from '../data/quizzes'
import { scoreQuiz } from '../lib/scoring'

export default function QuestionScreen() {
  const { quizId } = useParams()
  const navigate = useNavigate()
  const quiz = getQuiz(quizId)

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [pending, setPending] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [index])

  if (!quiz) return <Navigate to="/" replace />

  const question = quiz.questions[index]
  const isLast = index === quiz.questions.length - 1

  function choose(resultId) {
    if (pending) return
    setPending(resultId)

    const next = [...answers]
    next[index] = resultId

    setTimeout(() => {
      setAnswers(next)
      setPending(null)

      if (isLast) {
        const scored = scoreQuiz(quiz, next)
        navigate(`/quiz/${quiz.id}/result/${scored.resultId.toLowerCase()}`, {
          replace: true,
          state: scored,
        })
      } else {
        setIndex(index + 1)
      }
    }, 260)
  }

  function goBack() {
    if (index === 0) {
      navigate(`/quiz/${quiz.id}`)
    } else {
      setIndex(index - 1)
    }
  }

  return (
    <Layout hideFooter>
      <div className="animate-floatUp" key={question.id}>
        <ProgressBar current={index + 1} total={quiz.questions.length} />

        <section className="app-card">
          <h1 className="heading-md">{question.prompt}</h1>
          <p className="muted-text mt-2">Pick whichever feels closest. No wrong answers.</p>

          <div className="mt-4 space-y-2">
            {question.options.map((option) => {
              const selected = pending === option.result || answers[index] === option.result
              return (
                <button
                  key={option.result}
                  type="button"
                  onClick={() => choose(option.result)}
                  aria-pressed={selected}
                  className={`option ${selected ? 'option-selected' : ''}`}
                >
                  <span
                    className={`h-4 w-4 shrink-0 rounded-full border-2 transition ${
                      selected ? 'border-purple bg-purple' : 'border-purple/30'
                    }`}
                    aria-hidden="true"
                  />
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        <div className="mt-4 flex items-center justify-between">
          <button type="button" onClick={goBack} className="btn-text px-1 py-2">
            ← Back
          </button>
          <Link to="/" className="btn-text px-1 py-2">
            Quiz hub
          </Link>
        </div>
      </div>
    </Layout>
  )
}
