import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(form);
    if (res?.error) setError(res.error);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">Login</h2>
      {error && <div className="bg-red-100 p-2 mb-2">{error}</div>}
      <form onSubmit={submit} className="space-y-2">
        <input className="w-full p-2 border" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
        <input type="password" className="w-full p-2 border" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
        <button className="px-4 py-2 bg-blue-600 text-white">Login</button>
      </form>
      <div className="mt-4 text-sm text-center text-gray-600">
        Don't have an account? <Link to="/register" className="text-indigo-600 hover:underline">Register here</Link>
      </div>
    </div>
  );
};

export default LoginPage;
