import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      setUser({ token })
    }
  }, [token])

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <div className="App">
      {token ? (
        <Dashboard token={token} onLogout={handleLogout} />
      ) : (
        <Login onLogin={setToken} />
      )}
    </div>
  )
}

export default App
