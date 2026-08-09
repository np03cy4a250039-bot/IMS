import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSuppliers } from "../hooks/useInventory.js"
import { hasErrors, validateSupplier } from "../lib/validation.js"

export default function SupplierFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { addSupplier, updateSupplier, getSupplier } = useSuppliers()

  const existing = isEdit ? getSupplier(id) : null

  const [form, setForm] = useState({
    name: existing?.name || "",
    contactEmail: existing?.contactEmail || "",
    phone: existing?.phone || "",
  })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState("")

  if (isEdit && !existing) {
    return (
      <div className="card empty">
        <p>Supplier not found.</p>
        <button className="btn" onClick={() => navigate("/suppliers")}>Back to suppliers</button>
      </div>
    )
  }

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e) => {
    e.preventDefault()
    setSubmitError("")
    const v = validateSupplier(form)
    setErrors(v)
    if (hasErrors(v)) {
      setSubmitError("Please fix the errors below before saving.")
      return
    }
    const payload = {
      name: form.name.trim(),
      contactEmail: form.contactEmail.trim(),
      phone: form.phone.trim(),
    }
    if (isEdit) {
      updateSupplier(id, payload)
      navigate("/suppliers")
    } else {
      addSupplier(payload)
      navigate("/suppliers")
    }
  }

  const errClass = (k) => (errors[k] ? "field field-error" : "field")

  return (
    <section>
      <div className="toolbar">
        <h1>{isEdit ? "Edit Supplier" : "Add Supplier"}</h1>
      </div>

      <form className="card" onSubmit={onSubmit} noValidate>
        {submitError && <div className="form-error" role="alert">{submitError}</div>}

        <div className={errClass("name")}>
          <label className="field-label" htmlFor="name">Name *</label>
          <input id="name" type="text" value={form.name} onChange={onChange("name")} />
          {errors.name && <span className="field-error-text">{errors.name}</span>}
        </div>

        <div className={errClass("contactEmail")}>
          <label className="field-label" htmlFor="contactEmail">Contact Email *</label>
          <input id="contactEmail" type="email" value={form.contactEmail} onChange={onChange("contactEmail")} />
          {errors.contactEmail && <span className="field-error-text">{errors.contactEmail}</span>}
        </div>

        <div className={errClass("phone")}>
          <label className="field-label" htmlFor="phone">Phone *</label>
          <input id="phone" type="tel" value={form.phone} onChange={onChange("phone")} />
          {errors.phone && <span className="field-error-text">{errors.phone}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{isEdit ? "Save Changes" : "Create Supplier"}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
