export function validateProduct({ name, description, price, quantity, supplierId }) {
  const errors = {}
  if (!name || !name.trim()) errors.name = "Name is required."
  if (!description || !description.trim()) errors.description = "Description is required."
  if (price === "" || price == null) errors.price = "Price is required."
  else if (Number.isNaN(Number(price))) errors.price = "Price must be a number."
  else if (Number(price) < 0) errors.price = "Price cannot be negative."
  if (quantity === "" || quantity == null) errors.quantity = "Quantity is required."
  else if (!Number.isInteger(Number(quantity))) errors.quantity = "Quantity must be a whole number."
  else if (Number(quantity) < 0) errors.quantity = "Quantity cannot be negative."
  if (!supplierId) errors.supplierId = "Please choose a supplier."
  return errors
}

export function validateSupplier({ name, contactEmail, phone }) {
  const errors = {}
  if (!name || !name.trim()) errors.name = "Name is required."
  if (!contactEmail || !contactEmail.trim()) errors.contactEmail = "Contact email is required."
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
    errors.contactEmail = "Enter a valid email address."
  }
  if (!phone || !phone.trim()) errors.phone = "Phone is required."
  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
