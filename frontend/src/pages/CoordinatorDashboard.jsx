import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import axiosInstance from '../utils/axiosConfig';
import useAuth from '../hooks/useAuth';

const CoordinatorDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/coordinator/students')
      .then(r => setStudents(r.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Coordinator Dashboard</h2>
      <p className="text-slate-400 text-sm">Department: <span className="text-white font-semibold">{user?.department || '—'}</span></p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <p className="text-sm font-medium text-slate-400">Total Students</p>
          <p className="text-3xl font-bold mt-2 text-white">{students.length}</p>
        </div>
        <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
          <p className="text-sm font-medium text-slate-400">Active Students</p>
          <p className="text-3xl font-bold mt-2 text-white">{students.filter(s => s.active).length}</p>
        </div>
      </div>
    </div>
  );
};

export default CoordinatorDashboard;
