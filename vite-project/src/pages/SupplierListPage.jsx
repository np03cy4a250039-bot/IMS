import { Link, useNavigate } from "react-router-dom"
import { useProducts, useSuppliers } from "../hooks/useInventory.js"

export default function SupplierListPage() {
  const { suppliers, deleteSupplier } = useSuppliers()
  const { products } = useProducts()
  const navigate = useNavigate()

  const productCountBySupplier = products.reduce((acc, p) => {
    acc[p.supplierId] = (acc[p.supplierId] || 0) + 1
    return acc
  }, {})

  const onDelete = (s) => {
    const count = productCountBySupplier[s.id] || 0
    if (count > 0) {
      alert(`Cannot delete "${s.name}": ${count} product(s) are still linked to this supplier.`)
      return
    }
    if (confirm(`Delete supplier "${s.name}"?`)) {
      deleteSupplier(s.id)
    }
  }

  return (
    <section>
      <div className="toolbar">
        <h1>Suppliers</h1>
        <div className="spacer" />
        <Link to="/suppliers/new" className="btn btn-primary">+ Add Supplier</Link>
      </div>

      {suppliers.length === 0 ? (
        <div className="card empty">No suppliers yet. Add your first supplier to get started.</div>
      ) : (
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Name</th>
                <th>Contact Email</th>
                <th>Phone</th>
                <th>Products</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {suppliers
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((s) => (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>{s.contactEmail}</td>
                    <td>{s.phone}</td>
                    <td>{productCountBySupplier[s.id] || 0}</td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-sm" onClick={() => navigate(`/suppliers/${s.id}/edit`)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => onDelete(s)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
