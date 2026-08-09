import { useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useProducts, useSuppliers } from "../hooks/useInventory.js"

const LOW_STOCK_THRESHOLD = 5

export default function ProductListPage() {
  const { products, deleteProduct } = useProducts()
  const { suppliers } = useSuppliers()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [supplierId, setSupplierId] = useState("")

  const supplierNameById = useMemo(() => {
    const map = {}
    for (const s of suppliers) map[s.id] = s.name
    return map
  }, [suppliers])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return products
      .filter((p) => !supplierId || p.supplierId === supplierId)
      .filter((p) => !q || p.name.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [products, search, supplierId])

  const lowCount = useMemo(
    () => products.filter((p) => Number(p.quantity) < LOW_STOCK_THRESHOLD).length,
    [products],
  )

  const onDelete = (p) => {
    if (confirm(`Delete "${p.name}"? This cannot be undone.`)) {
      deleteProduct(p.id)
    }
  }

  return (
    <section>
      <div className="toolbar">
        <h1>Products</h1>
        {lowCount > 0 && (
          <span className="badge badge-low" title="Products with fewer than 5 in stock">
            {lowCount} low stock
          </span>
        )}
        <div className="spacer" />
        <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="filter-select"
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
        >
          <option value="">All suppliers</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card empty">
          {products.length === 0
            ? "No products yet. Add your first product to get started."
            : "No products match your filters."}
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Supplier</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const low = Number(p.quantity) < LOW_STOCK_THRESHOLD
                return (
                  <tr key={p.id} className={low ? "row-low-stock" : undefined}>
                    <td>
                      {p.imageDataUrl ? (
                        <img className="product-thumb" src={p.imageDataUrl} alt="" />
                      ) : (
                        <span className="product-thumb-placeholder">no image</span>
                      )}
                    </td>
                    <td>
                      <Link to={`/products/${p.id}`}>{p.name}</Link>
                    </td>
                    <td>{supplierNameById[p.supplierId] || "—"}</td>
                    <td>${Number(p.price).toFixed(2)}</td>
                    <td>{p.quantity}</td>
                    <td>
                      {low ? (
                        <span className="stock-pill stock-low">Low stock</span>
                      ) : (
                        <span className="stock-pill stock-ok">In stock</span>
                      )}
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-sm" onClick={() => navigate(`/products/${p.id}/edit`)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => onDelete(p)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
