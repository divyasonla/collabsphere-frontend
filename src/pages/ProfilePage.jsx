import React, { useEffect, useState } from 'react';
import api from '../services/api';

const MonthSquare = ({ label, count }) => {
  const level = Math.min(Math.floor((count || 0) / 1), 4);
  const colors = ['bg-gray-200', 'bg-green-200', 'bg-green-300', 'bg-green-500', 'bg-green-700'];
  const title = `${label} — ${count || 0} project(s)`;
  return (
    <div title={title} className="flex flex-col items-center">
      <div className={`w-12 h-8 rounded-sm ${colors[level]} border flex items-center justify-center text-xs`}>{count||0}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
};

const monthsRange = (centerDate, before = 6, after = 6) => {
  const months = [];
  for (let i = -before; i <= after; i++) {
    const d = new Date(centerDate.getFullYear(), centerDate.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    months.push({ date: d, key });
  }
  return months;
};

const ProfilePage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [monthCounts, setMonthCounts] = useState({});

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/users/me/profile');
        setData(data);
        // derive month-wise counts from submissionsByDate (YYYY-MM-DD -> YYYY-MM)
        const byDate = data.submissionsByDate || {};
        const byMonth = {};
        Object.keys(byDate).forEach(d => {
          const month = d.slice(0, 7);
          byMonth[month] = (byMonth[month] || 0) + (byDate[d] || 0);
        });
        setMonthCounts(byMonth);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !data) return <div className="p-6">Loading profile...</div>;

  const months = monthsRange(new Date(), 6, 6); // -6..+6 months

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
          <h3 className="font-semibold mb-2">Activity (last 6 months — next 6 months)</h3>
          <div className="grid grid-cols-7 gap-4">
            {months.map(m => {
              const label = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' }).format(m.date);
              const count = monthCounts[m.key] || 0;
              return <MonthSquare key={m.key} label={label} count={count} />;
            })}
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
