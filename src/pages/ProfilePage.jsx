import React, { useEffect, useState } from 'react';
import api from '../services/api';

const DaySquare = ({ date, count }) => {
  const level = Math.min(count || 0, 4);
  const colors = ['bg-gray-200', 'bg-green-200', 'bg-green-300', 'bg-green-500', 'bg-green-700'];
  const title = `${date} — ${count || 0} project(s)`;
  return (
    <div title={title} className={`w-6 h-6 rounded-sm ${colors[level]} border`} />
  );
};

const lastNDates = (n) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
};

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/users/me/profile');
        setData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !data) return <div className="p-6">Loading profile...</div>;

  const dates = lastNDates(30);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-indigo-200 flex items-center justify-center text-3xl font-bold text-white">{(data.user.name||'U')[0]}</div>
          <div>
            <h2 className="text-2xl font-semibold">{data.user.name}</h2>
            <div className="text-sm text-gray-500">{data.user.email}</div>
            <div className="mt-2 text-sm text-gray-600">Projects created: <strong>{data.projectsCount}</strong></div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Activity (last 30 days)</h3>
          <div className="flex flex-wrap gap-1">
            {dates.map(d => (
              <DaySquare key={d} date={d} count={data.submissionsByDate[d] || 0} />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Recent Projects</h3>
          <div className="space-y-3">
            {data.projects.slice(0,6).map(p => (
              <div key={p._id} className="p-3 border rounded bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{p.title}</div>
                    <div className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</div>
                  </div>
                  <a href={`/project/${p._id}`} className="text-indigo-600">Open</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
