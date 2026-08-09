import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/Login";
import ProductList from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import SupplierList from "./pages/Suppliers";
import './styles.css';

function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/" element={<Layout/>}>
          <Route index element={<ProductList/>} />
          <Route path="products/new" element={<ProductForm/>} />
          <Route path="products/:id/edit" element={<ProductForm/>} />
          <Route path="suppliers" element={<SupplierList/>} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
