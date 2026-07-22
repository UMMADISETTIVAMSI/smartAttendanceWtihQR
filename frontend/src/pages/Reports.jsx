import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import AttendanceTable from '../components/AttendanceTable';
import axiosInstance from '../utils/axiosConfig';
import useAuth from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

const Reports = () => {
  const { user } = useAuth();
  const isFaculty = user?.role === ROLES.FACULTY;
  const isAdmin = user?.role === ROLES.ADMIN;

  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ subjectId: '', from: '', to: '' });
  const [exporting, setExporting] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFaculty) {
      axiosInstance.get('/faculty/subjects').then((r) => setSubjects(r.data));
    }
  }, [isFaculty]);

  const handleExport = async (e) => {
    e.preventDefault();
    setExporting(true);
    try {
      const res = await axiosInstance.get('/faculty/attendance/export', {
        params: { subjectId: form.subjectId, from: form.from, to: form.to },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance.xlsx';
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Excel exported!');
    } catch {
      toast.error('Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleFetchAttendance = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? `/admin/attendance?date=${date}` : `/student/attendance/history`;
      const { data } = await axiosInstance.get(endpoint);
      setRecords(data);
    } catch {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) handleFetchAttendance();
  }, [date]);

  useEffect(() => {
    if (!isFaculty && !isAdmin) handleFetchAttendance();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-bold text-gray-800">Reports</h2>

      {isFaculty && (
        <div className="bg-white rounded-xl shadow p-6 space-y-4 max-w-xl">
          <h3 className="text-base font-semibold text-gray-700">Export Attendance to Excel</h3>
          <form onSubmit={handleExport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                required
                value={form.subjectId}
                onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.subjectName} ({s.subjectCode})</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  required
                  type="date"
                  value={form.from}
                  onChange={(e) => setForm({ ...form, from: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  required
                  type="date"
                  value={form.to}
                  onChange={(e) => setForm({ ...form, to: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={exporting}
              className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-60"
            >
              {exporting ? 'Exporting...' : '⬇ Export Excel'}
            </button>
          </form>
        </div>
      )}

      {isAdmin && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-semibold text-gray-700">Attendance by Date</h3>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {loading ? <Loading /> : <AttendanceTable records={records} />}
        </div>
      )}

      {!isFaculty && !isAdmin && (
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-gray-700">My Attendance History</h3>
          {loading ? <Loading /> : <AttendanceTable records={records} />}
        </div>
      )}
    </div>
  );
};

export default Reports;
