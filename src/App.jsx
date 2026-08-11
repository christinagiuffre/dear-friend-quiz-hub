import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import QuizHubHome from './pages/QuizHubHome'
import QuizIntro from './pages/QuizIntro'
import QuestionScreen from './pages/QuestionScreen'
import ResultScreen from './pages/ResultScreen'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizHubHome />} />
        <Route path="/quiz/:quizId" element={<QuizIntro />} />
        <Route path="/quiz/:quizId/play" element={<QuestionScreen />} />
        <Route path="/quiz/:quizId/result/:resultId" element={<ResultScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
