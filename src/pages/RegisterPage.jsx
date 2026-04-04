import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await register(form);
    if (res?.error) setError(res.error);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Register</h2>
      {error && <div className="bg-red-100 p-2 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-2">
        <input className="w-full p-2 border" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input className="w-full p-2 border" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input type="password" className="w-full p-2 border" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button className="px-4 py-2 bg-blue-600 text-white">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
