import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Products.css'

function Products({ token }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    supplier_id: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts(response.data)
    } catch (err) {
      setError('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        supplier_id: '',
      })
      setShowForm(false)
      fetchProducts()
    } catch (err) {
      setError('Failed to add product')
    }
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products</h2>
        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <form className="product-form" onSubmit={handleAddProduct}>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            required
          />
          <button type="submit">Add Product</button>
        </form>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p className="price">${product.price}</p>
              <p className="quantity">Stock: {product.quantity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
