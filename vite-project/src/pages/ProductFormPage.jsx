import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useProducts, useSuppliers } from "../hooks/useInventory.js"
import { hasErrors, validateProduct } from "../lib/validation.js"

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error("Failed to read file."))
    reader.readAsDataURL(file)
  })
}

export default function ProductFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { addProduct, updateProduct, getProduct } = useProducts()
  const { suppliers } = useSuppliers()

  const existing = isEdit ? getProduct(id) : null

  const [form, setForm] = useState(() => ({
    name: existing?.name || "",
    description: existing?.description || "",
    price: existing ? String(existing.price) : "",
    quantity: existing ? String(existing.quantity) : "",
    supplierId: existing?.supplierId || suppliers[0]?.id || "",
    imageDataUrl: existing?.imageDataUrl || "",
  }))
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")

  if (isEdit && !existing) {
    return (
      <div className="card empty">
        <p>Product not found.</p>
        <button className="btn" onClick={() => navigate("/products")}>Back to products</button>
      </div>
    )
  }

  const onChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setErrors((er) => ({ ...er, image: "Please choose an image file." }))
      e.target.value = ""
      return
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((er) => ({ ...er, image: "Image must be 2 MB or smaller." }))
      e.target.value = ""
      return
    }
    const dataUrl = await readFileAsDataUrl(file)
    setForm((f) => ({ ...f, imageDataUrl: dataUrl }))
    setErrors((er) => {
      const next = { ...er }
      delete next.image
      return next
    })
  }

  const clearImage = () => {
    setForm((f) => ({ ...f, imageDataUrl: "" }))
  }

  const onSubmit = (e) => {
    e.preventDefault()
    setSubmitError("")
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: form.price === "" ? "" : Number(form.price),
      quantity: form.quantity === "" ? "" : Number(form.quantity),
      supplierId: form.supplierId,
      imageDataUrl: form.imageDataUrl,
    }
    const v = validateProduct(payload)
    setErrors(v)
    if (hasErrors(v)) {
      setSubmitError("Please fix the errors below before saving.")
      return
    }
    if (isEdit) {
      updateProduct(id, payload)
      navigate(`/products/${id}`)
    } else {
      const created = addProduct(payload)
      navigate(`/products/${created.id}`)
    }
  }

  const errClass = (k) => (errors[k] ? "field field-error" : "field")

  return (
    <section>
      <div className="toolbar">
        <h1>{isEdit ? "Edit Product" : "Add Product"}</h1>
      </div>

      <form className="card" onSubmit={onSubmit} noValidate>
        {submitError && <div className="form-error" role="alert">{submitError}</div>}

        <div className="form-grid">
          <div className={errClass("name")}>
            <label className="field-label" htmlFor="name">Name *</label>
            <input id="name" type="text" value={form.name} onChange={onChange("name")} />
            {errors.name && <span className="field-error-text">{errors.name}</span>}
          </div>

          <div className={errClass("supplierId")}>
            <label className="field-label" htmlFor="supplierId">Supplier *</label>
            <select id="supplierId" value={form.supplierId} onChange={onChange("supplierId")}>
              <option value="">— Select a supplier —</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.supplierId && <span className="field-error-text">{errors.supplierId}</span>}
          </div>

          <div className={errClass("price") + " full"}>
            <label className="field-label" htmlFor="description">Description *</label>
            <textarea id="description" value={form.description} onChange={onChange("description")} />
            {errors.description && <span className="field-error-text">{errors.description}</span>}
          </div>

          <div className={errClass("price")}>
            <label className="field-label" htmlFor="price">Price *</label>
            <input id="price" type="number" min="0" step="0.01" value={form.price} onChange={onChange("price")} />
            {errors.price && <span className="field-error-text">{errors.price}</span>}
          </div>

          <div className={errClass("quantity")}>
            <label className="field-label" htmlFor="quantity">Quantity *</label>
            <input id="quantity" type="number" min="0" step="1" value={form.quantity} onChange={onChange("quantity")} />
            {errors.quantity && <span className="field-error-text">{errors.quantity}</span>}
          </div>

          <div className={"field full " + (errors.image ? "field-error" : "")}>
            <label className="field-label">Image</label>
            <div className="image-upload">
              {form.imageDataUrl ? (
                <img className="preview" src={form.imageDataUrl} alt="Preview" />
              ) : (
                <span className="preview-placeholder">No image</span>
              )}
              <div>
                <input type="file" accept="image/*" onChange={onFile} />
                <div style={{ marginTop: 6, fontSize: 12, color: "var(--muted)" }}>
                  Max 2 MB. Choose an image file from your computer.
                </div>
                {form.imageDataUrl && (
                  <button type="button" className="btn btn-sm" onClick={clearImage} style={{ marginTop: 6 }}>
                    Remove image
                  </button>
                )}
              </div>
            </div>
            {errors.image && <span className="field-error-text">{errors.image}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{isEdit ? "Save Changes" : "Create Product"}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
