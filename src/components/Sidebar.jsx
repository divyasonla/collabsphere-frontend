import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ onCreateClick }) => {
  const linkClass = ({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded ${isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`;
  return (
    <aside className="w-64 bg-gray-900 min-h-screen text-gray-300 fixed left-0 top-0 z-50"> 
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="text-white font-bold">CollabSphere</div>
      </div>
      <nav className="mt-4">
        <NavLink to="/dashboard" className={linkClass} end>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/projects" className={linkClass}>
          <span>My Projects</span>
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          <span>Profile</span>
        </NavLink>
        <NavLink to="/create-project" className={linkClass}>
        {/* <button onClick={onCreateClick} className="w-full text-left flex items-center gap-3 px-4 py-2 rounded text-gray-300 hover:bg-gray-800 hover:text-white"> */}
          <span>Create Project</span>
        {/* </button> */}
        </NavLink>
        {/* Settings removed */}
        
      </nav>
    </aside>
  );
};

export default Sidebar;
