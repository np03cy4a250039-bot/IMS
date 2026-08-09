import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Suppliers.css'

function Suppliers({ token }) {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/suppliers', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuppliers(response.data)
    } catch (err) {
      setError('Failed to fetch suppliers')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSupplier = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/suppliers', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFormData({
        name: '',
        email: '',
        phone: '',
      })
      setShowForm(false)
      fetchSuppliers()
    } catch (err) {
      setError('Failed to add supplier')
    }
  }

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h2>Suppliers</h2>
        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Supplier'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="supplier-form" onSubmit={handleAddSupplier}>
          <input
            type="text"
            placeholder="Supplier Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <button type="submit">Add Supplier</button>
        </form>
      )}

      {loading ? (
        <p>Loading suppliers...</p>
      ) : suppliers.length === 0 ? (
        <p>No suppliers found</p>
      ) : (
        <div className="suppliers-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email || '-'}</td>
                  <td>{supplier.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Suppliers
