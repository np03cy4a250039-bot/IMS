import { useEffect, useState } from "react"
import { storage } from "../lib/storage.js"
import { hashPassword, verifyPassword } from "../lib/crypto.js"
import { seedIfNeeded } from "../lib/seed.js"
import { AuthContext } from "./authContextObject.js"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      await seedIfNeeded()
      if (cancelled) return
      setUser(storage.getSession())
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const login = async (username, password) => {
    const users = storage.getUsers()
    const found = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase())
    if (!found) return { ok: false, error: "Invalid username or password." }
    const ok = await verifyPassword(password, found.salt, found.hash)
    if (!ok) return { ok: false, error: "Invalid username or password." }
    const session = { id: found.id, username: found.username }
    storage.setSession(session)
    setUser(session)
    return { ok: true }
  }

  const logout = () => {
    storage.setSession(null)
    setUser(null)
  }

  const changePassword = async (currentPw, newPw) => {
    if (!user) return { ok: false, error: "Not logged in." }
    const users = storage.getUsers()
    const idx = users.findIndex((u) => u.id === user.id)
    if (idx === -1) return { ok: false, error: "User not found." }
    const ok = await verifyPassword(currentPw, users[idx].salt, users[idx].hash)
    if (!ok) return { ok: false, error: "Current password is incorrect." }
    const { salt, hash } = await hashPassword(newPw)
    users[idx] = { ...users[idx], salt, hash }
    storage.setUsers(users)
    return { ok: true }
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  )
}
