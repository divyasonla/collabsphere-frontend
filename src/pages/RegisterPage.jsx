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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-semibold text-center mb-4">Create your account</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Join CollabSphere to collaborate smarter</p>
        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-3 mb-4 rounded">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            className="w-full p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <button className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">Register</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
