import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import FacultyCard from '../components/FacultyCard';
import AttendanceTable from '../components/AttendanceTable';
import axiosInstance from '../utils/axiosConfig';

const FacultyDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [todayAttendance, setTodayAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/faculty/profile'),
      axiosInstance.get('/faculty/subjects'),
      axiosInstance.get('/faculty/attendance/today'),
    ])
      .then(([p, s, a]) => {
        setProfile(p.data);
        setSubjects(s.data);
        setTodayAttendance(a.data);
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Faculty Dashboard</h2>

      <FacultyCard faculty={profile} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 text-blue-700 rounded-xl p-4 shadow-sm">
          <p className="text-sm font-medium">Assigned Subjects</p>
          <p className="text-2xl font-bold mt-1">{subjects.length}</p>
        </div>
        <div className="bg-green-50 text-green-700 rounded-xl p-4 shadow-sm">
          <p className="text-sm font-medium">Today's Attendance</p>
          <p className="text-2xl font-bold mt-1">{todayAttendance.length}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Today's Attendance</h3>
        <AttendanceTable records={todayAttendance} />
      </div>
    </div>
  );
};

export default FacultyDashboard;
