import { useState, useEffect } from 'react'
import { api } from '../api/client'
import '../styles/Suppliers.css'

function emptyForm() {
  return {
    name: '',
    email: '',
    phone: '',
  }
}

function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm())
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const response = await api.getSuppliers()
      setSuppliers(response.data)
    } catch (err) {
      setError('Failed to fetch suppliers')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData(emptyForm())
    setEditingId(null)
  }

  const handleEdit = (supplier) => {
    setFormData({
      name: supplier.name || '',
      email: supplier.email || '',
      phone: supplier.phone || '',
    })
    setEditingId(supplier.id)
    setShowForm(true)
  }

  const handleDelete = async (supplier) => {
    if (!confirm(`Delete supplier "${supplier.name}"?`)) return
    try {
      await api.deleteSupplier(supplier.id)
      fetchSuppliers()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete supplier')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      if (editingId) {
        await api.updateSupplier(editingId, formData)
      } else {
        await api.createSupplier(formData)
      }
      resetForm()
      setShowForm(false)
      fetchSuppliers()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save supplier')
    }
  }

  const cancelForm = () => {
    resetForm()
    setShowForm(false)
  }

  return (
    <div className="suppliers-container">
      <div className="suppliers-header">
        <h2>Suppliers</h2>
        <button
          className="add-btn"
          onClick={() => {
            resetForm()
            setShowForm(!showForm)
          }}
        >
          {showForm ? 'Cancel' : 'Add Supplier'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="supplier-form" onSubmit={handleSubmit}>
          <h3 className="form-title">
            {editingId ? 'Edit Supplier' : 'New Supplier'}
          </h3>
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
          <div className="form-actions">
            <button type="submit">
              {editingId ? 'Update Supplier' : 'Add Supplier'}
            </button>
            <button type="button" className="cancel-btn" onClick={cancelForm}>
              Cancel
            </button>
          </div>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.email || '-'}</td>
                  <td>{supplier.phone || '-'}</td>
                  <td className="actions-cell">
                    <button className="edit-btn" onClick={() => handleEdit(supplier)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(supplier)}>
                      Delete
                    </button>
                  </td>
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