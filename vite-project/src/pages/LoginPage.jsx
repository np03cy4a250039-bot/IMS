import { useState } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth.js"

export default function LoginPage() {
  const { user, ready, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  if (ready && user) {
    const dest = location.state?.from || "/products"
    return <Navigate to={dest} replace />
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    if (!username.trim() || !password) {
      setError("Username and password are required.")
      return
    }
    setSubmitting(true)
    const res = await login(username, password)
    setSubmitting(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    const dest = location.state?.from || "/products"
    navigate(dest, { replace: true })
  }

  return (
    <div className="login-page">
      <form className="card login-card" onSubmit={onSubmit} noValidate>
        <h1 className="login-title">Admin Login</h1>
        <p className="login-subtitle">Sign in to manage your inventory.</p>

        <label className="field">
          <span className="field-label">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="field">
          <span className="field-label">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <div className="form-error" role="alert">{error}</div>}

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Signing in..." : "Sign In"}
        </button>

        <p className="login-hint">
          Demo credentials — Username: <code>admin</code>, Password: <code>admin123</code>
        </p>
      </form>
    </div>
  )
}
