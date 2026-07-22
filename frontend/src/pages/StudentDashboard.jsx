import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import StudentCard from '../components/StudentCard';
import { getStudentProfileApi, getAttendanceSummaryApi, getSubjectWiseAttendanceApi } from '../services/studentService';
import { getAttendanceColor } from '../utils/helpers';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getStudentProfileApi(), getAttendanceSummaryApi(), getSubjectWiseAttendanceApi()])
      .then(([p, s, sub]) => {
        setProfile(p.data);
        setSummary(s.data);
        setSubjects(sub.data);
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const stats = [
    { label: 'Total Classes', value: summary?.total ?? 0, color: 'bg-blue-50 text-blue-700' },
    { label: 'Present', value: summary?.present ?? 0, color: 'bg-green-50 text-green-700' },
    { label: 'Absent', value: summary?.absent ?? 0, color: 'bg-red-50 text-red-700' },
    { label: 'Attendance %', value: `${summary?.percentage ?? 0}%`, color: 'bg-purple-50 text-purple-700' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Student Dashboard</h2>

      <StudentCard student={profile} percentage={summary?.percentage} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className={`rounded-xl p-4 ${color} shadow-sm`}>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Subject-wise Attendance</h3>
        <div className="grid gap-3">
          {subjects.map((s) => (
            <div key={s.subjectCode} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{s.subjectName}</p>
                <p className="text-xs text-gray-500">{s.subjectCode} · {s.present}/{s.total} classes</p>
              </div>
              <span className={`text-lg font-bold ${getAttendanceColor(s.percentage)}`}>
                {s.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
