import React, { useEffect, useState } from 'react';
import projectService from '../services/projectService';
import { Link } from 'react-router-dom';

const MyProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await projectService.getMyProjects();
      if (!res?.error) setProjects(res);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="pt-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Projects</h1>
          <div className="text-sm text-gray-500">Your projects and collaborative workspaces</div>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : projects.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center">You have not created or joined any projects yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link key={p._id} to={`/project/${p._id}`} className="block bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold underline decoration-indigo-200 decoration-2">{p.title}</h3>
                  {p.isPublic && <span className="text-xs inline-block mt-2 px-2 py-1 bg-indigo-50 text-indigo-600 rounded">PUBLIC</span>}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">{p.description || 'No description'}</p>
              <div className="mt-4 text-xs text-gray-400 flex justify-between">
                <div>{(p.members||[]).length} members</div>
                <div>· {new Date(p.createdAt).toLocaleDateString()}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProjectsPage;
