import React, { useState } from "react";
import API from '../api/api';
import { saveToken } from '../api/auth';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setError(null);
    try {
      const res = await API.post('/auth/login', { username, password });
      saveToken(res.data.token);
      navigate('/');
    } catch (err){
      setError(err.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="card">
      <h2>Admin Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={submit}>
        <label>Username<input value={username} onChange={e=>setUsername(e.target.value)} required/></label>
        <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
