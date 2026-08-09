import { useCallback, useEffect, useState } from "react"
import { storage } from "../lib/storage.js"

function newId() {
  return crypto.randomUUID()
}

export function useProducts() {
  const [products, setProducts] = useState(() => storage.getProducts())

  useEffect(() => {
    const refresh = () => setProducts(storage.getProducts())
    window.addEventListener("ims:products", refresh)
    return () => window.removeEventListener("ims:products", refresh)
  }, [])

  const persist = useCallback((updater) => {
    setProducts((current) => {
      const next = updater(current)
      storage.setProducts(next)
      window.dispatchEvent(new Event("ims:products"))
      return next
    })
  }, [])

  const addProduct = useCallback(
    (data) => {
      const product = { id: newId(), ...data }
      persist((list) => [...list, product])
      return product
    },
    [persist],
  )

  const updateProduct = useCallback(
    (id, data) => {
      persist((list) => list.map((p) => (p.id === id ? { ...p, ...data } : p)))
    },
    [persist],
  )

  const deleteProduct = useCallback(
    (id) => {
      persist((list) => list.filter((p) => p.id !== id))
    },
    [persist],
  )

  const getProduct = useCallback((id) => products.find((p) => p.id === id), [products])

  return { products, addProduct, updateProduct, deleteProduct, getProduct }
}

export function useSuppliers() {
  const [suppliers, setSuppliers] = useState(() => storage.getSuppliers())

  useEffect(() => {
    const refresh = () => setSuppliers(storage.getSuppliers())
    window.addEventListener("ims:suppliers", refresh)
    return () => window.removeEventListener("ims:suppliers", refresh)
  }, [])

  const persist = useCallback((updater) => {
    setSuppliers((current) => {
      const next = updater(current)
      storage.setSuppliers(next)
      window.dispatchEvent(new Event("ims:suppliers"))
      return next
    })
  }, [])

  const addSupplier = useCallback(
    (data) => {
      const supplier = { id: newId(), ...data }
      persist((list) => [...list, supplier])
      return supplier
    },
    [persist],
  )

  const updateSupplier = useCallback(
    (id, data) => {
      persist((list) => list.map((s) => (s.id === id ? { ...s, ...data } : s)))
    },
    [persist],
  )

  const deleteSupplier = useCallback(
    (id) => {
      persist((list) => list.filter((s) => s.id !== id))
    },
    [persist],
  )

  const getSupplier = useCallback((id) => suppliers.find((s) => s.id === id), [suppliers])

  return { suppliers, addSupplier, updateSupplier, deleteSupplier, getSupplier }
}
