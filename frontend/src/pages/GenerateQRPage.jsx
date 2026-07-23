import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Zap, BookOpen, Clock, Users, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import QRGenerator from '../components/QRGenerator';
import { generateQRApi } from '../services/qrService';
import axiosInstance from '../utils/axiosConfig';

const GenerateQRPage = () => {
  const location = useLocation();
  const [subjects, setSubjects] = useState([]);
  const [savedSections, setSavedSections] = useState([]);
  const [form, setForm] = useState({ subjectId: '', section: '', period: '', durationMinutes: '5' });
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Attendance tracking state
  const [sessionInfo, setSessionInfo] = useState(null); // { scanned, scannedCount, totalInSection, ... }
  const [polling, setPolling] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const pollRef = useRef(null);

  useEffect(() => {
    axiosInstance.get('/faculty/subjects').then(r => setSubjects(r.data));
    axiosInstance.get('/faculty/my-sections').then(r => setSavedSections(r.data));

    if (location.state?.subjectId || location.state?.section) {
      setForm(f => ({
        ...f,
        subjectId: location.state.subjectId || '',
        section: location.state.section || '',
      }));
    }

    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, []);

  const applySection = (entry) => {
    setForm(f => ({ ...f, subjectId: entry.subjectId || '', section: entry.section || '' }));
    setQrData(null);
    setSessionInfo(null);
    toast.success(`Pre-filled: ${entry.department} · Yr${entry.year} · Sec ${entry.section}`);
  };

  const startPolling = (sessionId) => {
    setPolling(true);
    const fetchScanned = async () => {
      try {
        const { data } = await axiosInstance.get(`/qr/session/${sessionId}/scanned`);
        setSessionInfo(data[0]);
      } catch { /* silent */ }
    };
    fetchScanned();
    pollRef.current = setInterval(fetchScanned, 5000);
  };

  const stopPolling = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    setPolling(false);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQrData(null);
    setSessionInfo(null);
    setConfirmed(false);
    stopPolling();
    try {
      const { data } = await generateQRApi(form.subjectId, form.section, parseInt(form.period), parseInt(form.durationMinutes));
      setQrData(data);
      toast.success(`QR valid for ${form.durationMinutes} minute(s)!`);
      startPolling(data.sessionId);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate QR');
    } finally {
      setLoading(false);
    }
  };

  const handleExpire = () => {
    toast('QR expired. Students can no longer scan.', { icon: '⏰' });
    stopPolling();
    // do one final fetch
    if (qrData?.sessionId) {
      axiosInstance.get(`/qr/session/${qrData.sessionId}/scanned`)
        .then(r => setSessionInfo(r.data[0]));
    }
  };

  const handleConfirm = async () => {
    try {
      await axiosInstance.post(`/qr/session/${qrData.sessionId}/confirm`);
      toast.success('Attendance confirmed and saved!');
      setConfirmed(true);
      stopPolling();
    } catch {
      toast.error('Failed to confirm attendance');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel attendance? All scanned records will be deleted.')) return;
    try {
      await axiosInstance.post(`/qr/session/${qrData.sessionId}/cancel`);
      toast.success('Attendance cancelled');
      setQrData(null);
      setSessionInfo(null);
      setConfirmed(false);
      stopPolling();
    } catch {
      toast.error('Failed to cancel attendance');
    }
  };

  const countMatch = sessionInfo && sessionInfo.totalInSection > 0
    && sessionInfo.scannedCount === sessionInfo.totalInSection;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-white">Generate QR Code</h2>
        <p className="text-slate-400 text-sm mt-1">Generate attendance QR for your class section</p>
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
                key={entry.id || i}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => applySection(entry)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                  form.section === entry.section && form.subjectId === (entry.subjectId || '')
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
                    <span className="text-purple-300">{entry.subjectName}</span>
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
              required value={form.subjectId}
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
              required value={form.section}
              onChange={e => setForm({ ...form, section: e.target.value })}
              placeholder="e.g. A"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5">Period</label>
            <input
              required type="number" min="1" max="8" value={form.period}
              onChange={e => setForm({ ...form, period: e.target.value })}
              placeholder="1 – 8"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-400 text-xs font-medium mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-yellow-400" /> QR Valid Duration (minutes)
            </label>
            <div className="flex gap-2 flex-wrap">
              {[2, 5, 10, 15, 30].map(m => (
                <button
                  key={m} type="button"
                  onClick={() => setForm({ ...form, durationMinutes: String(m) })}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    form.durationMinutes === String(m)
                      ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {m} min
                </button>
              ))}
              <input
                type="number" min="1" max="60" value={form.durationMinutes}
                onChange={e => setForm({ ...form, durationMinutes: e.target.value })}
                className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500/50"
                placeholder="custom"
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          type="submit" disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 disabled:opacity-60 transition-all"
        >
          <QrCode className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate QR Code'}
        </motion.button>
      </form>

      {/* QR Display */}
      <AnimatePresence>
        {qrData && !confirmed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4"
          >
            <div className="text-center">
              <p className="text-white font-bold text-lg">{qrData.subjectName}</p>
              <p className="text-slate-400 text-sm">Section {form.section} · Period {form.period} · {form.durationMinutes} min</p>
            </div>
            <QRGenerator
              qrImage={qrData.qrImage}
              expiresAt={qrData.expiresAt}
              onExpire={handleExpire}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scanned Students Panel */}
      <AnimatePresence>
        {sessionInfo && !confirmed && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center gap-3 flex-wrap">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-semibold">Scanned Students</span>
              {polling && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Live
                </span>
              )}
              <div className="ml-auto flex items-center gap-3">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  countMatch ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                }`}>
                  {sessionInfo.scannedCount} / {sessionInfo.totalInSection} scanned
                </span>
              </div>
            </div>

            {/* Count match message */}
            <div className={`px-5 py-3 text-sm font-medium flex items-center gap-2 ${
              countMatch ? 'bg-green-500/10 text-green-300' : 'bg-yellow-500/10 text-yellow-300'
            }`}>
              {countMatch
                ? <><CheckCircle className="w-4 h-4" /> All students in section have scanned!</>
                : <><XCircle className="w-4 h-4" /> {sessionInfo.totalInSection - sessionInfo.scannedCount} student(s) haven't scanned yet</>
              }
            </div>

            {/* Student list */}
            {sessionInfo.scanned?.length > 0 ? (
              <div className="divide-y divide-white/5">
                {sessionInfo.scanned.map((s, i) => (
                  <div key={s.studentId} className="flex items-center gap-3 px-5 py-3">
                    <span className="text-slate-600 text-xs w-5 text-right">{i + 1}</span>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs font-bold">
                      {s.name?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{s.name}</p>
                      <p className="text-slate-400 text-xs">{s.rollNumber}</p>
                    </div>
                    <span className="text-xs text-slate-500">{s.scannedAt}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-sm">Waiting for students to scan...</div>
            )}

            {/* Confirm / Cancel */}
            <div className="px-5 py-4 border-t border-white/10 flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition-all"
              >
                <XCircle className="w-4 h-4" /> Cancel Attendance
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                disabled={sessionInfo.scannedCount === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-green-500/20 disabled:opacity-50 transition-all"
              >
                <CheckCircle className="w-4 h-4" /> Confirm Attendance ({sessionInfo.scannedCount})
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmed state */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center"
          >
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-white font-bold text-lg">Attendance Confirmed!</p>
            <p className="text-slate-400 text-sm mt-1">
              {sessionInfo?.scannedCount} student(s) marked present for {qrData?.subjectName} · Section {form.section}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setQrData(null); setSessionInfo(null); setConfirmed(false); }}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold"
            >
              Generate Another QR
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenerateQRPage;
