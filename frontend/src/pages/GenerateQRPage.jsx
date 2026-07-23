import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Zap, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import QRGenerator from '../components/QRGenerator';
import { generateQRApi } from '../services/qrService';
import axiosInstance from '../utils/axiosConfig';
import { SECTION_KEY } from './MySection';

const GenerateQRPage = () => {
  const location = useLocation();
  const [subjects, setSubjects] = useState([]);
  const [savedSections, setSavedSections] = useState([]);
  const [form, setForm] = useState({ subjectId: '', section: '', period: '' });
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get('/faculty/subjects').then(r => setSubjects(r.data));
    const saved = localStorage.getItem(SECTION_KEY);
    setSavedSections(saved ? JSON.parse(saved) : []);

    // pre-fill if navigated from MySection QR button
    if (location.state?.subjectId || location.state?.section) {
      setForm(f => ({
        ...f,
        subjectId: location.state.subjectId || '',
        section: location.state.section || '',
      }));
    }
  }, []);

  const applySection = (entry) => {
    setForm(f => ({
      ...f,
      subjectId: entry.subjectId || '',
      section: entry.section || '',
    }));
    setQrData(null);
    toast.success(`Pre-filled: ${entry.department} · Yr${entry.year} · Sec ${entry.section}`);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQrData(null);
    try {
      const { data } = await generateQRApi(form.subjectId, form.section, parseInt(form.period));
      setQrData(data);
      toast.success('QR Code generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate QR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Generate QR Code</h2>
        <p className="text-slate-400 text-sm mt-1">Generate attendance QR for your class</p>
      </div>

      {/* Quick select from saved sections */}
      {savedSections.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-400" />
            <p className="text-white text-sm font-semibold">Quick Select from My Sections</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {savedSections.map((entry, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => applySection(entry)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  form.section === entry.section && form.subjectId === entry.subjectId
                    ? 'bg-blue-500/30 border-blue-500/50 text-blue-200'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>{entry.department}</span>
                <span className="text-slate-500">·</span>
                <span>Yr{entry.year}</span>
                <span className="text-slate-500">·</span>
                <span>Sec {entry.section}</span>
                {entry.subjectName && (
                  <>
                    <span className="text-slate-500">·</span>
                    <BookOpen className="w-3 h-3 text-purple-400" />
                    <span className="text-purple-300">{entry.subjectCode}</span>
                  </>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleGenerate} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Subject</label>
            <select
              required
              value={form.subjectId}
              onChange={e => setForm({ ...form, subjectId: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
            >
              <option value="" className="bg-slate-800">Select Subject</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id} className="bg-slate-800">
                  {s.subjectName} ({s.subjectCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Section</label>
            <input
              required
              value={form.section}
              onChange={e => setForm({ ...form, section: e.target.value })}
              placeholder="e.g. A"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Period</label>
            <input
              required
              type="number"
              min="1"
              max="8"
              value={form.period}
              onChange={e => setForm({ ...form, period: e.target.value })}
              placeholder="1 – 8"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-60 transition-all"
        >
          <QrCode className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate QR Code'}
        </motion.button>
      </form>

      {/* QR Display */}
      <AnimatePresence>
        {qrData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4"
          >
            <div className="text-center">
              <p className="text-white font-bold text-lg">{qrData.subjectName}</p>
              <p className="text-slate-400 text-sm">Section {form.section} · Period {form.period}</p>
            </div>
            <QRGenerator
              qrImage={qrData.qrImage}
              expiresAt={qrData.expiresAt}
              onExpire={() => toast('QR expired. Generate a new one.', { icon: '⏰' })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenerateQRPage;
