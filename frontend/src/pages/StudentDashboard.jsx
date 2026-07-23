import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, UserCheck, TrendingUp, Calendar, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import axiosInstance from '../utils/axiosConfig';
import { getStudentProfileApi, getAttendanceSummaryApi, getSubjectWiseAttendanceApi } from '../services/studentService';

const getPercentageColor = (p) => {
  if (p >= 75) return { bar: 'from-green-500 to-emerald-400', text: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' };
  if (p >= 60) return { bar: 'from-yellow-500 to-orange-400', text: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' };
  return { bar: 'from-red-500 to-rose-400', text: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
};

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getStudentProfileApi(),
      getAttendanceSummaryApi(),
      getSubjectWiseAttendanceApi(),
      axiosInstance.get('/student/faculty'),
      axiosInstance.get('/student/attendance/history'),
    ])
      .then(([p, s, sub, f, h]) => {
        setProfile(p.data);
        setSummary(s.data);
        setSubjects(sub.data);
        setFaculty(f.data);
        setHistory(h.data);
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const overallPct = summary?.percentage ?? 0;
  const colors = getPercentageColor(overallPct);

  return (
    <div className="space-y-6">

      {/* Profile + Overall Attendance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Card */}
        <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
            {profile?.user?.name?.charAt(0) || profile?.name?.charAt(0) || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white">{profile?.user?.name || profile?.name}</h2>
            <p className="text-slate-400 text-sm">{profile?.rollNumber} · {profile?.department}</p>
            <p className="text-slate-500 text-xs mt-0.5">Year {profile?.year} · Section {profile?.section}</p>
          </div>
          <div className={`text-center border rounded-2xl px-5 py-3 ${colors.bg}`}>
            <p className={`text-3xl font-bold ${colors.text}`}>{overallPct}%</p>
            <p className="text-xs text-slate-400 mt-0.5">Overall</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 md:grid-cols-1 gap-3">
          {[
            { label: 'Total', value: summary?.total ?? 0, icon: Calendar, color: 'text-blue-400' },
            { label: 'Present', value: summary?.present ?? 0, icon: CheckCircle, color: 'text-green-400' },
            { label: 'Absent', value: summary?.absent ?? 0, icon: XCircle, color: 'text-red-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
              <Icon className={`w-5 h-5 ${color} flex-shrink-0`} />
              <div>
                <p className="text-white font-bold text-lg leading-none">{value}</p>
                <p className="text-slate-400 text-xs mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Faculty Section */}
      {faculty.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <UserCheck className="w-5 h-5 text-purple-400" />
            <h3 className="text-white font-semibold">Your Faculty</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {faculty.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/8 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {f.facultyName?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{f.facultyName}</p>
                    <p className="text-slate-400 text-xs truncate">{f.designation}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl px-3 py-2">
                  <p className="text-blue-300 text-xs font-medium">{f.subjectName}</p>
                  <p className="text-slate-500 text-xs">{f.subjectCode}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Subject-wise Attendance */}
      {subjects.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <h3 className="text-white font-semibold">Subject-wise Attendance</h3>
          </div>
          <div className="space-y-3">
            {subjects.map((s) => {
              const c = getPercentageColor(s.percentage);
              return (
                <motion.div
                  key={s.subjectCode}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-white text-sm font-semibold">{s.subjectName}</p>
                      <p className="text-slate-400 text-xs">{s.subjectCode} · {s.present}/{s.total} classes attended</p>
                    </div>
                    <span className={`text-lg font-bold ${c.text}`}>{s.percentage}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(s.percentage, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${c.bar}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Attendance History */}
      {history.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-semibold">Recent Attendance</h3>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Subject', 'Faculty', 'Date', 'Period', 'Status'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {history.slice(0, 10).map((r) => (
                    <tr key={r.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-white text-sm font-medium">{r.subjectName}</p>
                        <p className="text-slate-500 text-xs">{r.subjectCode}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{r.facultyName}</td>
                      <td className="px-4 py-3 text-slate-300 text-sm">{r.date}</td>
                      <td className="px-4 py-3 text-slate-400 text-sm">{r.period}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.status === 'PRESENT' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
