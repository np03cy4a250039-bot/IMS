import { Navigate, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import ProductListPage from "./pages/ProductListPage.jsx"
import ProductViewPage from "./pages/ProductViewPage.jsx"
import ProductFormPage from "./pages/ProductFormPage.jsx"
import SupplierListPage from "./pages/SupplierListPage.jsx"
import SupplierFormPage from "./pages/SupplierFormPage.jsx"

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="products" element={<ProductListPage />} />
        <Route path="products/new" element={<ProductFormPage />} />
        <Route path="products/:id" element={<ProductViewPage />} />
        <Route path="products/:id/edit" element={<ProductFormPage />} />
        <Route path="suppliers" element={<SupplierListPage />} />
        <Route path="suppliers/new" element={<SupplierFormPage />} />
        <Route path="suppliers/:id/edit" element={<SupplierFormPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  )
}
