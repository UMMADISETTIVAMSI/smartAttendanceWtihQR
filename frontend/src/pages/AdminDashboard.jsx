import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import axiosInstance from '../utils/axiosConfig';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/admin/stats/students'),
      axiosInstance.get('/admin/stats/faculty'),
      axiosInstance.get('/admin/stats/subjects'),
    ])
      .then(([s, f, sub]) => setStats({ students: s.data, faculty: f.data, subjects: sub.data }))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const cards = [
    { label: 'Total Students', value: stats?.students ?? 0, color: 'bg-blue-50 text-blue-700' },
    { label: 'Total Faculty', value: stats?.faculty ?? 0, color: 'bg-green-50 text-green-700' },
    { label: 'Total Subjects', value: stats?.subjects ?? 0, color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map(({ label, value, color }) => (
          <div key={label} className={`rounded-2xl p-6 bg-white/5 border border-white/10 shadow-sm`}>
            <p className="text-sm font-medium text-slate-400">{label}</p>
            <p className="text-3xl font-bold mt-2 text-white">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
