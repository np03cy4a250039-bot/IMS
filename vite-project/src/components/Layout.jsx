import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../context/useAuth.js"

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">IMS</div>
          <nav className="nav">
            <NavLink to="/products" className="nav-link">Products</NavLink>
            <NavLink to="/suppliers" className="nav-link">Suppliers</NavLink>
          </nav>
          <div className="user-area">
            <span className="user-name">Signed in as <strong>{user?.username}</strong></span>
            <button className="btn btn-ghost" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">Inventory Management System</footer>
    </div>
  )
}
