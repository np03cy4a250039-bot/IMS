const KEYS = {
  users: "ims.users",
  session: "ims.session",
  products: "ims.products",
  suppliers: "ims.suppliers",
  seeded: "ims.seeded.v1",
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const storage = {
  getUsers: () => read(KEYS.users, []),
  setUsers: (v) => write(KEYS.users, v),
  getSession: () => read(KEYS.session, null),
  setSession: (v) => (v ? write(KEYS.session, v) : localStorage.removeItem(KEYS.session)),
  getProducts: () => read(KEYS.products, []),
  setProducts: (v) => write(KEYS.products, v),
  getSuppliers: () => read(KEYS.suppliers, []),
  setSuppliers: (v) => write(KEYS.suppliers, v),
  isSeeded: () => read(KEYS.seeded, false),
  markSeeded: () => write(KEYS.seeded, true),
}
