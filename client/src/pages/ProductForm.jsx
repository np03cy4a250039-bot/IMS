import React, { useState, useEffect } from "react";
import API from '../api/api';
import { getToken } from '../api/auth';
import { useNavigate, useParams } from 'react-router-dom';

export default function ProductForm(){
  const { id } = useParams();
  const [form, setForm] = useState({ name:'', sku:'', price:'', quantity:0, supplierId:'', image:null });
  const [suppliers, setSuppliers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = getToken();

  useEffect(()=>{ fetchSuppliers(); if(id) fetchProduct(); }, [id]);
  async function fetchSuppliers(){ const r = await API.get('/suppliers'); setSuppliers(r.data); }
  async function fetchProduct(){ const r = await API.get(`/products/${id}`); setForm({ ...r.data, image:null, supplierId: r.data.supplierId }); }

  function setField(k,v){ setForm(s=> ({...s,[k]:v})); }

  function validate(){ if(!form.name) return 'Name required'; if(!form.price || Number(form.price)<=0) return 'Price must be positive'; if(Number(form.quantity)<0) return 'Quantity cannot be negative'; if(!form.supplierId) return 'Supplier required'; return null }

  async function submit(e){ e.preventDefault(); setError(null); const v = validate(); if(v){ setError(v); return; }
    const data = new FormData(); data.append('name', form.name); data.append('sku', form.sku); data.append('price', form.price); data.append('quantity', form.quantity); data.append('supplierId', form.supplierId); if(form.image) data.append('image', form.image);
    try {
      const hdrs = { 'Content-Type': 'multipart/form-data' };
      if(id) await API.put(`/products/${id}`, data, { headers: hdrs });
      else await API.post('/products', data, { headers: hdrs });
      navigate('/');
    } catch (err){ setError(err.response?.data?.error || 'Save failed'); }
  }

  return (
    <div className="card">
      <h2>{id? 'Edit' : 'New'} Product</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <label>Name<input value={form.name} onChange={e=>setField('name', e.target.value)} required/></label>
        <label>SKU<input value={form.sku} onChange={e=>setField('sku', e.target.value)}/></label>
        <label>Price<input type="number" step="0.01" value={form.price} onChange={e=>setField('price', e.target.value)} required/></label>
        <label>Quantity<input type="number" value={form.quantity} onChange={e=>setField('quantity', e.target.value)} required min={0}/></label>
        <label>Supplier
          <select value={form.supplierId} onChange={e=>setField('supplierId', e.target.value)} required>
            <option value="">Select</option>
            {suppliers.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label>Image<input type="file" accept="image/*" onChange={e=>setField('image', e.target.files[0])} /></label>
        <div className="form-actions"><button type="submit">Save</button><button type="button" onClick={()=>navigate(-1)}>Cancel</button></div>
      </form>
    </div>
  );
}
