import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth/me', { withCredentials: true })
        setUserId(response.data.userId)
      } catch {
        setUserId(null)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true })
    } catch {
      // ignore
    }
    setUserId(null)
  }

  const handleLogin = () => {
    checkAuth()
  }

  if (loading) {
    return <div className="app-loading">Loading...</div>
  }

  return (
    <div className="App">
      {userId ? (
        <Dashboard userId={userId} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App