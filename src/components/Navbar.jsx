import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-indigo-600">CollabSphere</div>
        <div className="hidden md:flex items-center bg-gray-100 border border-gray-200 rounded px-3 py-1 ml-4">
          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>
          <input className="bg-transparent outline-none text-sm" placeholder="Search projects, notes..." />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden sm:inline-flex items-center px-3 py-1 rounded bg-indigo-50 text-indigo-600 text-sm">New</button>
        <button className="p-2 rounded hover:bg-gray-100" title="Notifications">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9"/></svg>
        </button>
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-700 hidden sm:block">{user.name}</div>
            <button onClick={logout} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
