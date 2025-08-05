import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/useAuthStore' // adjust path as needed

import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/signUpPage'
import { HomePage } from './pages/HomePage'

function App() {
  const authUser = useAuthStore((state) => state.authUser)

  return (
    <Router>
      <Routes>
        {/* Default route based on auth */}
        <Route path="/" element={authUser ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </Router>
  )
}

export default App
