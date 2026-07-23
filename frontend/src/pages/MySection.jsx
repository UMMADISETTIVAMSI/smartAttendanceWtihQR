import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, BookOpen, QrCode, Trash2, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosConfig';

export const SECTION_KEY = 'faculty_sections';

const tabLabel = (entry) =>
  `${entry.department} · Y${entry.year} · ${entry.section}${entry.subjectName ? ` · ${entry.subjectName}` : ''}`;

const StudentList = ({ entry }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('/faculty/students', {
        params: { department: entry.department, year: entry.year, section: entry.section },
      })
      .then((r) => setStudents(r.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  }, [entry.department, entry.year, entry.section]);

  if (loading)
    return <div className="p-10 text-center text-slate-400 text-sm">Loading students...</div>;

  if (students.length === 0)
    return (
      <div className="p-10 text-center text-slate-400 text-sm">No students in this section yet.</div>
    );

  return (
    <div className="divide-y divide-white/5">
      {students.map((s, i) => (
        <div key={s.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors">
          <span className="text-slate-600 text-xs w-6 text-right flex-shrink-0">{i + 1}</span>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {(s.name || s.user?.name || '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">{s.name || s.user?.name}</p>
            <p className="text-slate-400 text-xs">{s.rollNumber}</p>
          </div>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
              s.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}
          >
            {s.active ? 'Active' : 'Inactive'}
          </span>
        </div>
      ))}
    </div>
  );
};

const MySection = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(SECTION_KEY);
    setSections(saved ? JSON.parse(saved) : []);
  }, []);

  const handleRemove = (idx) => {
    const updated = sections.filter((_, i) => i !== idx);
    setSections(updated);
    localStorage.setItem(SECTION_KEY, JSON.stringify(updated));
    setActiveTab((prev) => Math.min(prev, updated.length - 1));
    toast.success('Section removed');
  };

  if (sections.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
          <Users className="w-8 h-8 text-slate-500" />
        </div>
        <p className="text-white font-semibold text-lg">No Sections Added</p>
        <p className="text-slate-400 text-sm text-center max-w-xs">
          Go to Dashboard, select department / year / section / subject and click "Add to My Sections".
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/faculty/dashboard')}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold"
        >
          Go to Dashboard
        </motion.button>
      </div>
    );

  const active = sections[activeTab] ?? sections[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Sections</h2>
          <p className="text-slate-400 text-sm mt-1">{sections.length} section{sections.length !== 1 ? 's' : ''} added</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/faculty/dashboard')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" /> Add Section
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {sections.map((entry, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeTab === i
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <span className="max-w-[200px] truncate">{tabLabel(entry)}</span>
            <span
              onClick={(e) => { e.stopPropagation(); handleRemove(i); }}
              className="ml-1 p-0.5 rounded-full hover:bg-red-500/30 hover:text-red-400 transition-colors"
            >
              <X className="w-3 h-3" />
            </span>
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      {active && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
        >
          {/* Section Info Bar */}
          <div className="px-5 py-4 flex items-center gap-3 flex-wrap border-b border-white/10">
            <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full">
              {active.department}
            </span>
            <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-3 py-1 rounded-full">
              Year {active.year}
            </span>
            <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full">
              Section {active.section}
            </span>
            {active.subjectName && (
              <span className="bg-green-500/20 text-green-300 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {active.subjectName}
              </span>
            )}
            <div className="ml-auto flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  navigate('/faculty/generate-qr', {
                    state: { section: active.section, subjectId: active.subjectId, department: active.department, year: active.year, subjectName: active.subjectName },
                  })
                }
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold"
              >
                <QrCode className="w-3.5 h-3.5" /> Generate QR
              </motion.button>
            </div>
          </div>

          {/* Students */}
          <StudentList entry={active} />
        </motion.div>
      )}
    </div>
  );
};

export default MySection;
