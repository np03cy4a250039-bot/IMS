import { storage } from "./storage.js"
import { hashPassword } from "./crypto.js"

export async function seedIfNeeded() {
  if (storage.isSeeded()) return
  const { salt, hash } = await hashPassword("admin123")
  storage.setUsers([
    {
      id: crypto.randomUUID(),
      username: "admin",
      salt,
      hash,
    },
  ])
  const sup1 = { id: crypto.randomUUID(), name: "Acme Supplies", contactEmail: "[email protected]", phone: "555-0100" }
  const sup2 = { id: crypto.randomUUID(), name: "Global Goods Co.", contactEmail: "[email protected]", phone: "555-0200" }
  const sup3 = { id: crypto.randomUUID(), name: "Northwind Traders", contactEmail: "[email protected]", phone: "555-0300" }
  storage.setSuppliers([sup1, sup2, sup3])
  storage.setProducts([
    {
      id: crypto.randomUUID(),
      name: "Wireless Mouse",
      description: "Ergonomic 2.4GHz wireless mouse with USB receiver.",
      price: 19.99,
      quantity: 3,
      supplierId: sup1.id,
      imageDataUrl: "",
    },
    {
      id: crypto.randomUUID(),
      name: "Mechanical Keyboard",
      description: "RGB backlit mechanical keyboard with blue switches.",
      price: 89.5,
      quantity: 12,
      supplierId: sup2.id,
      imageDataUrl: "",
    },
    {
      id: crypto.randomUUID(),
      name: "USB-C Hub",
      description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.",
      price: 34.0,
      quantity: 2,
      supplierId: sup3.id,
      imageDataUrl: "",
    },
    {
      id: crypto.randomUUID(),
      name: "Webcam 1080p",
      description: "Full HD webcam with built-in microphone.",
      price: 45.0,
      quantity: 25,
      supplierId: sup1.id,
      imageDataUrl: "",
    },
  ])
  storage.markSeeded()
}
