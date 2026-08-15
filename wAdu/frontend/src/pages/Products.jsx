import { useState, useEffect, useRef } from 'react'
import { api } from '../api/client'
import '../styles/Products.css'

function emptyForm() {
  return {
    name: '',
    description: '',
    price: '',
    quantity: '',
    supplier_id: '',
  }
}

function Products() {
  const [products, setProducts] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(emptyForm())
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchProducts()
    fetchSuppliers()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await api.getProducts()
      setProducts(response.data)
    } catch (err) {
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchSuppliers = async () => {
    try {
      const response = await api.getSuppliers()
      setSuppliers(response.data)
    } catch (err) {
      console.error('Failed to fetch suppliers', err)
    }
  }

  const resetForm = () => {
    setFormData(emptyForm())
    setImageFile(null)
    setImagePreview('')
    setEditingId(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      quantity: product.quantity ?? '',
      supplier_id: product.supplier_id ?? '',
    })
    setImageFile(null)
    setImagePreview(product.image_url ? product.image_url : '')
    setEditingId(product.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.name}"?`)) return
    try {
      await api.deleteProduct(product.id)
      fetchProducts()
    } catch (err) {
      setError('Failed to delete product')
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const data = new FormData()
      data.append('name', formData.name)
      data.append('description', formData.description)
      data.append('price', formData.price)
      data.append('quantity', formData.quantity)
      if (formData.supplier_id) data.append('supplier_id', formData.supplier_id)
      if (imageFile) data.append('image', imageFile)

      if (editingId) {
        await api.updateProduct(editingId, data)
      } else {
        await api.createProduct(data)
      }

      resetForm()
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save product')
    } finally {
      setSubmitting(false)
    }
  }

  const cancelForm = () => {
    resetForm()
    setShowForm(false)
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products</h2>
        {!showForm && (
          <button className="add-btn" onClick={() => setShowForm(true)}>
            + Add Product
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>
          <h3 className="form-title">
            {editingId ? 'Edit Product' : 'New Product'}
          </h3>

          <div className="image-upload">
            <div className="image-preview">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" />
              ) : (
                <div className="image-placeholder">No image</div>
              )}
            </div>
            <div className="image-upload-controls">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageChange}
                id="product-image"
              />
              <label htmlFor="product-image" className="file-label">
                {imageFile || imagePreview ? 'Change Image' : 'Choose Image'}
              </label>
              {(imageFile || imagePreview) && (
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview('')
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={submitting}
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            disabled={submitting}
          />
          <div className="form-row">
            <input
              type="number"
              placeholder="Price"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              disabled={submitting}
            />
            <input
              type="number"
              placeholder="Quantity"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
              disabled={submitting}
            />
          </div>

          <select
            value={formData.supplier_id}
            onChange={(e) => setFormData({ ...formData, supplier_id: e.target.value })}
            disabled={submitting}
          >
            <option value="">— Select Supplier (optional) —</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
            </button>
            <button type="button" className="cancel-btn" onClick={cancelForm} disabled={submitting}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="status-text">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="status-text">No products yet. Click "Add Product" to start.</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} />
                ) : (
                  <div className="product-image-placeholder">📦</div>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                {product.description && <p className="product-desc">{product.description}</p>}
                {product.supplier_name && (
                  <p className="product-supplier">Supplier: {product.supplier_name}</p>
                )}
                <p className={`product-stock ${product.quantity == 0 ? 'out-of-stock' : product.quantity < 5 ? 'low-stock' : 'in-stock'}`}>
                  {product.quantity == 0 ? 'Out of stock' : product.quantity < 5 ? `Only ${product.quantity} left` : `${product.quantity} in stock`}
                </p>
                <div className="product-meta">
                  <span className="price">${Number(product.price).toFixed(2)}</span>
                </div>
                <div className="card-actions">
                  <button className="edit-btn" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(product)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products