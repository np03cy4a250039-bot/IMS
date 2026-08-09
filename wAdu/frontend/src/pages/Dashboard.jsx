import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Dashboard.css'
import Products from './Products'
import Suppliers from './Suppliers'

function Dashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('products')

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>IMS Dashboard</h1>
        <div className="nav-buttons">
          <button
            className={`nav-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Products
          </button>
          <button
            className={`nav-btn ${activeTab === 'suppliers' ? 'active' : ''}`}
            onClick={() => setActiveTab('suppliers')}
          >
            Suppliers
          </button>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="content">
        {activeTab === 'products' && <Products token={token} />}
        {activeTab === 'suppliers' && <Suppliers token={token} />}
      </div>
    </div>
  )
}

export default Dashboard
