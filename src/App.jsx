import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import QuizHubHome from './pages/QuizHubHome'
import QuizIntro from './pages/QuizIntro'
import CheckInPlay from './pages/CheckInPlay'
import CheckInResult from './pages/CheckInResult'
import BoredomResult from './pages/BoredomResult'
import ThoughtChallengerPlay from './pages/ThoughtChallengerPlay'
import ThoughtChallengerResult from './pages/ThoughtChallengerResult'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizHubHome />} />
        <Route path="/quiz/:quizId" element={<QuizIntro />} />
        <Route path="/quiz/:quizId/play" element={<CheckInPlay />} />
        <Route path="/quiz/:quizId/reflect" element={<ThoughtChallengerPlay />} />
        <Route path="/quiz/:quizId/result/suggestions" element={<BoredomResult />} />
        <Route path="/quiz/:quizId/result/complete" element={<ThoughtChallengerResult />} />
        <Route path="/quiz/:quizId/result/:resultId" element={<CheckInResult />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
