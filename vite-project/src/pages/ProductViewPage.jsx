import { Link, useNavigate, useParams } from "react-router-dom"
import { useProducts, useSuppliers } from "../hooks/useInventory.js"

const LOW_STOCK_THRESHOLD = 5

export default function ProductViewPage() {
  const { id } = useParams()
  const { getProduct, deleteProduct } = useProducts()
  const { getSupplier } = useSuppliers()
  const navigate = useNavigate()

  const product = getProduct(id)

  if (!product) {
    return (
      <div className="card empty">
        <p>Product not found.</p>
        <Link to="/products" className="btn">Back to products</Link>
      </div>
    )
  }

  const supplier = getSupplier(product.supplierId)
  const low = Number(product.quantity) < LOW_STOCK_THRESHOLD

  const onDelete = () => {
    if (confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      deleteProduct(product.id)
      navigate("/products", { replace: true })
    }
  }

  return (
    <section>
      <div className="toolbar">
        <Link to="/products" className="btn btn-ghost">← Back</Link>
        <div className="spacer" />
        <Link to={`/products/${product.id}/edit`} className="btn btn-primary">Edit</Link>
        <button className="btn btn-danger" onClick={onDelete}>Delete</button>
      </div>

      <div className="product-detail">
        <div className="image">
          {product.imageDataUrl ? (
            <img src={product.imageDataUrl} alt={product.name} />
          ) : (
            <span style={{ color: "var(--muted)" }}>No image uploaded</span>
          )}
        </div>
        <div className="info">
          <h1 style={{ margin: 0 }}>{product.name}</h1>
          {low && <span className="stock-pill stock-low">Low stock ({product.quantity} left)</span>}
          <div className="price">${Number(product.price).toFixed(2)}</div>
          <p className="desc">{product.description}</p>

          <dl className="meta">
            <dt>Stock</dt>
            <dd>{product.quantity}</dd>
            <dt>Supplier</dt>
            <dd>
              {supplier ? (
                <Link to={`/suppliers`}>{supplier.name}</Link>
              ) : (
                <em style={{ color: "var(--muted)" }}>No supplier assigned</em>
              )}
            </dd>
            {supplier && (
              <>
                <dt>Supplier email</dt>
                <dd>{supplier.contactEmail}</dd>
                <dt>Supplier phone</dt>
                <dd>{supplier.phone}</dd>
              </>
            )}
          </dl>
        </div>
      </div>
    </section>
  )
}
