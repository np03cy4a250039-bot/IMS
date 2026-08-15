import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { getToken, logout } from '../api/auth';

export default function Layout(){
  const navigate = useNavigate();
  const token = getToken();
  const handleLogout = () => { logout(); navigate('/login'); };
  return (
    <div className="app">
      <nav className="topnav">
        <Link to="/">Products</Link>
        <Link to="/suppliers">Suppliers</Link>
        {token ? <button onClick={handleLogout}>Logout</button> : <Link to="/login">Login</Link>}
      </nav>
      <main className="container">
        <Outlet />
      </main>
    </div>
  );
}
