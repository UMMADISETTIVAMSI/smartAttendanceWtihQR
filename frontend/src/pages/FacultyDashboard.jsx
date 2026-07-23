import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Filter, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import axiosInstance from '../utils/axiosConfig';

const YEARS = [1, 2, 3, 4];
const SECTIONS = ['A', 'B', 'C', 'D', 'E'];

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sectionCount, setSectionCount] = useState(0);

  const [selectedDept, setSelectedDept] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');

  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    Promise.all([
      axiosInstance.get('/faculty/profile'),
      axiosInstance.get('/faculty/departments'),
      axiosInstance.get('/faculty/my-sections'),
    ])
      .then(([p, d, s]) => {
        setProfile(p.data);
        setDepartments(d.data);
        setSectionCount(s.data.length);
      })
      .catch(() => toast.error('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = async () => {
    if (!selectedDept || !selectedYear || !selectedSection) {
      toast.error('Please select department, year and section');
      return;
    }
    setStudentsLoading(true);
    setSearched(true);
    try {
      const { data } = await axiosInstance.get('/faculty/students', {
        params: { department: selectedDept, year: selectedYear, section: selectedSection },
      });
      setStudents(data);
    } catch {
      toast.error('Failed to load students');
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleAddSection = async () => {
    if (!selectedDept || !selectedYear || !selectedSection) {
      toast.error('Please select department, year and section');
      return;
    }
    try {
      await axiosInstance.post('/faculty/my-sections', {
        department: selectedDept,
        year: parseInt(selectedYear),
        section: selectedSection,
        subjectName: selectedSubjectId.trim() || null,
        subjectId: null,
        subjectCode: null,
      });
      toast.success(`${selectedDept} · Yr${selectedYear} · Sec ${selectedSection} added!`);
      navigate('/faculty/my-section');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Section already added or failed');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="space-y-6">

      {/* Profile Header */}
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
          {profile?.name?.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
          <p className="text-slate-400 text-sm">{profile?.designation} · {profile?.department}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <div className="text-center bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2">
            <p className="text-2xl font-bold text-green-400">{sectionCount}</p>
            <p className="text-xs text-slate-400">My Sections</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold">Select Section</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Department</label>
            <select
              value={selectedDept}
              onChange={e => { setSelectedDept(e.target.value); setStudents([]); setSearched(false); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            >
              <option value="" className="bg-slate-800">Select Department</option>
              {departments.map(d => (
                <option key={d} value={d} className="bg-slate-800">{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Year</label>
            <select
              value={selectedYear}
              onChange={e => { setSelectedYear(e.target.value); setStudents([]); setSearched(false); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            >
              <option value="" className="bg-slate-800">Select Year</option>
              {YEARS.map(y => (
                <option key={y} value={y} className="bg-slate-800">Year {y}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Section</label>
            <select
              value={selectedSection}
              onChange={e => { setSelectedSection(e.target.value); setStudents([]); setSearched(false); }}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            >
              <option value="" className="bg-slate-800">Select Section</option>
              {SECTIONS.map(s => (
                <option key={s} value={s} className="bg-slate-800">Section {s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Subject <span className="text-slate-500">(optional)</span></label>
            <input
              type="text"
              value={selectedSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              placeholder="e.g. Data Structures"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSearch}
            disabled={studentsLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium disabled:opacity-60"
          >
            <Search className="w-4 h-4" />
            {studentsLoading ? 'Loading...' : 'View Students'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleAddSection}
            disabled={!selectedDept || !selectedYear || !selectedSection}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-green-500/20 disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            Add to My Sections
          </motion.button>
        </div>
      </div>

      {/* Students Preview */}
      <AnimatePresence>
        {searched && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">
                {selectedDept} · Year {selectedYear} · Section {selectedSection}
              </span>
              <span className="ml-auto bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">
                {students.length} students
              </span>
            </div>

            {studentsLoading ? (
              <div className="p-8 text-center text-slate-400">Loading...</div>
            ) : students.length === 0 ? (
              <div className="p-10 text-center">
                <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400">No students found for this section.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {students.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/5 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {(s.name || s.user?.name || '?').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{s.name || s.user?.name}</p>
                      <p className="text-slate-400 text-xs">{s.rollNumber}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                      {s.active ? 'Active' : 'Inactive'}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacultyDashboard;
