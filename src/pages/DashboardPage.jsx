import React, { useEffect, useState, useContext } from 'react';
import projectService from '../services/projectService';
import { AuthContext } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await projectService.getMyProjects();
      if (!res?.error) setProjects(res);
      setLoading(false);
    };
    load();
  }, []);

  const create = async () => {
    if (!title) return;
    const res = await projectService.createProject({ title, description: '' });
    if (res?._id) setProjects([res, ...projects]);
    setTitle('');
  };

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <div className="text-sm text-gray-500">{projects.length} projects total{search ? ` · showing ${projects.filter(p => (p.title||'').toLowerCase().includes(search.toLowerCase()) || (p.description||'').toLowerCase().includes(search.toLowerCase())).length}` : ''}</div>
        </div>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded w-64"
            placeholder="Search projects by title or description..."
          />
          <button onClick={() => window.dispatchEvent(new CustomEvent('openCreateProject'))} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded">New Project</button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .filter(p => {
              if (!search) return true;
              const q = search.toLowerCase();
              return (p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
            })
            .map((p) => (
            <div key={p._id} className="bg-white rounded-lg shadow p-4 text-left">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  {p.isPublic && <span className="text-xs inline-block mt-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded">PUBLIC</span>}
                </div>
                <a href={`/project/${p._id}`} className="text-gray-400 hover:text-gray-600">→</a>
              </div>
              <p className="text-sm text-gray-500 mt-3">{p.description || 'No description'}</p>
              <div className="mt-4 text-xs text-gray-400 flex justify-between">
                <div>{(p.members||[]).length} members</div>
                <div>· {new Date(p.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
