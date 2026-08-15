import React, { useEffect, useState } from "react";
import API from '../api/api';
import { getToken } from '../api/auth';
import { Link, useNavigate } from 'react-router-dom';

function LowStockBadge({q}){ return q<5 ? <span className="badge low">Low</span> : null }

export default function Products(){
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [filter, setFilter] = useState('');
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const token = getToken();

  useEffect(()=>{ fetch(); fetchSuppliers(); }, []);
  async function fetch(){
    const res = await API.get('/products', { params: { supplierId: filter || undefined, q: q || undefined } });
    setProducts(res.data);
  }
  async function fetchSuppliers(){ const r = await API.get('/suppliers'); setSuppliers(r.data); }
  function goEdit(id){ navigate(`/products/${id}/edit`); }
  async function remove(id){ if(!confirm('Delete product?')) return; await API.delete(`/products/${id}`, { headers: token?{Authorization:`Bearer ${token}`}:{} }); fetch(); }

  return (
    <div>
      <div className="toolbar">
        <div>
          <select value={filter} onChange={e=>{setFilter(e.target.value); fetch();}}>
            <option value="">All suppliers</option>
            {suppliers.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} />
          <button onClick={fetch}>Search</button>
        </div>
        <div>
          {token ? <Link to="/products/new" className="btn">Add Product</Link> : null}
        </div>
      </div>
      <div className="grid">
        {products.map(p=> {
          const apiRoot = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(/\/api\/?$/,'');
          const img = p.imageUrl ? (p.imageUrl.startsWith('http') ? p.imageUrl : `${apiRoot}${p.imageUrl}`) : '/placeholder.png';
          return (
            <div className={`card ${p.quantity<5? 'low':''}`} key={p.id}>
              <img src={img} alt="" />
              <h3>{p.name} <LowStockBadge q={p.quantity} /></h3>
              <p>Supplier: {p.Supplier?.name}</p>
              <p>Price: ${p.price} Qty: {p.quantity}</p>
              <div className="actions">
                <button onClick={()=>navigate(`/products/${p.id}`)}>View</button>
                {token && <><button onClick={()=>goEdit(p.id)}>Edit</button><button onClick={()=>remove(p.id)}>Delete</button></>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
