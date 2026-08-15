import React, { useState, useEffect } from "react";
import API from '../api/api';
import { getToken } from '../api/auth';

export default function Suppliers(){
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:'', contactEmail:'', phone:'', address:'' });
  const [error, setError] = useState(null);
  const token = getToken();

  useEffect(()=>{ fetch(); }, []);
  async function fetch(){ const r = await API.get('/suppliers'); setSuppliers(r.data); }
  function setField(k,v){ setForm(s=>({...s,[k]:v})); }
  async function submit(e){ e.preventDefault(); setError(null); if(!form.name) { setError('Name required'); return; } if(!/^[^@]+@[^@]+\.[^@]+$/.test(form.contactEmail)) { setError('Valid email required'); return; }
    try{ await API.post('/suppliers', form, { headers: token?{Authorization:`Bearer ${token}`}:{} }); setForm({ name:'', contactEmail:'', phone:'', address:'' }); setShowForm(false); fetch(); }catch(err){ setError(err.response?.data?.error || 'Save failed'); }
  }
  async function remove(id){ if(!confirm('Delete supplier?')) return; try{ await API.delete(`/suppliers/${id}`, { headers: token?{Authorization:`Bearer ${token}`}:{} }); fetch(); }catch(err){ alert(err.response?.data?.error || 'Delete failed'); }}

  return (
    <div>
      <div className="toolbar">
        <h2>Suppliers</h2>
        {token && <button onClick={()=>setShowForm(s=>!s)}>{showForm? 'Close' : 'Add Supplier'}</button>}
      </div>
      {showForm && <div className="card">
        {error && <div className="error">{error}</div>}
        <form onSubmit={submit}>
          <label>Name<input value={form.name} onChange={e=>setField('name', e.target.value)} required/></label>
          <label>Contact Email<input value={form.contactEmail} onChange={e=>setField('contactEmail', e.target.value)} required/></label>
          <label>Phone<input value={form.phone} onChange={e=>setField('phone', e.target.value)}/></label>
          <label>Address<textarea value={form.address} onChange={e=>setField('address', e.target.value)} /></label>
          <div className="form-actions"><button type="submit">Save</button></div>
        </form>
      </div>}
      <div className="list">
        {suppliers.map(s=> (
          <div className="card" key={s.id}>
            <h3>{s.name}</h3>
            <p>{s.contactEmail}</p>
            <p>{s.phone}</p>
            <div className="actions">{token && <button onClick={()=>remove(s.id)}>Delete</button>}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
