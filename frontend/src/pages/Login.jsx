import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, QrCode, ArrowLeft, CheckCircle, ScanLine } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { loginApi } from '../services/authService';
import { getRoleRedirect } from '../utils/helpers';

const qrPattern = [
  1,1,1,1,1,1,1,
  1,0,0,0,0,0,1,
  1,0,1,0,1,0,1,
  1,0,0,0,0,0,1,
  1,0,1,0,1,0,1,
  1,0,0,0,0,0,1,
  1,1,1,1,1,1,1,
];

const QRAnimation = () => {
  const [step, setStep] = useState(0);
  // steps: 0=idle, 1=scanning, 2=verified

  useEffect(() => {
    const cycle = () => {
      setStep(0);
      setTimeout(() => setStep(1), 1000);
      setTimeout(() => setStep(2), 3000);
      setTimeout(() => setStep(0), 5500);
    };
    cycle();
    const interval = setInterval(cycle, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full">

      {/* QR Code Box */}
      <div className="relative">
        {/* Glow ring */}
        <motion.div
          animate={{ opacity: step === 1 ? [0.4, 0.8, 0.4] : 0 }}
          transition={{ duration: 1, repeat: Infinity }}
          className="absolute inset-0 rounded-3xl bg-blue-500/30 blur-xl"
        />

        <motion.div
          animate={{ scale: step === 2 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.4 }}
          className="relative bg-white rounded-3xl p-5 shadow-2xl w-44 h-44 flex items-center justify-center"
        >
          {/* QR Grid */}
          <div className="grid grid-cols-7 gap-0.5 w-full h-full">
            {qrPattern.map((cell, i) => (
              <motion.div
                key={i}
                animate={{
                  backgroundColor: step === 2
                    ? '#22c55e'
                    : cell ? '#0f172a' : 'transparent',
                }}
                transition={{ duration: 0.3, delay: step === 2 ? i * 0.005 : 0 }}
                className="rounded-sm"
              />
            ))}
          </div>

          {/* Scan line */}
          <AnimatePresence>
            {step === 1 && (
              <motion.div
                initial={{ top: '10%' }}
                animate={{ top: '90%' }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
                className="absolute left-2 right-2 h-0.5 bg-blue-500 shadow-lg shadow-blue-500/80"
                style={{ position: 'absolute' }}
              />
            )}
          </AnimatePresence>

          {/* Verified checkmark */}
          <AnimatePresence>
            {step === 2 && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="absolute inset-0 flex items-center justify-center bg-green-500/20 rounded-3xl"
              >
                <CheckCircle className="w-14 h-14 text-green-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Corner brackets */}
        {[
          'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
          'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
          'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
          'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
        ].map((cls, i) => (
          <motion.div
            key={i}
            animate={{ opacity: step === 1 ? 1 : 0.3 }}
            transition={{ duration: 0.5 }}
            className={`absolute w-5 h-5 border-blue-400 ${cls} -m-1`}
          />
        ))}
      </div>

      {/* Status label */}
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2"
          >
            <QrCode className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm font-medium">Waiting to scan...</span>
          </motion.div>
        )}
        {step === 1 && (
          <motion.div
            key="scanning"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-5 py-2"
          >
            <ScanLine className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-blue-300 text-sm font-medium">Scanning QR Code...</span>
          </motion.div>
        )}
        {step === 2 && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-5 py-2"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Attendance Marked!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((s) => (
          <motion.div
            key={s}
            animate={{ scale: step === s ? 1.4 : 1, opacity: step === s ? 1 : 0.3 }}
            className="w-2 h-2 rounded-full bg-blue-400"
          />
        ))}
      </div>
    </div>
  );
};

const Login = () => {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginApi({ identifier: form.identifier, password: form.password });
      login({ name: data.name, email: data.email, role: data.role, id: data.id }, data.token);
      toast.success(`Welcome back, ${data.name}!`);
      navigate(getRoleRedirect(data.role));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity }}
          className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/25 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl shadow-black/40">

        {/* Left Panel — Animation */}
        <div className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-blue-600/20 to-purple-700/20 backdrop-blur-xl border border-white/10 p-10">
          <QRAnimation />
        </div>

        {/* Right Panel — Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-slate-900/80 backdrop-blur-xl border border-white/10 p-8 lg:p-10 flex flex-col justify-center"
        >
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Smart<span className="text-blue-400">QR</span></span>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-extrabold text-white mb-1">Welcome back</h3>
            <p className="text-slate-400 text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Email or Username</label>
              <input
                type="text" required value={form.identifier}
                onChange={e => setForm({ ...form, identifier: e.target.value })}
                placeholder="Email or your name"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/10 transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-slate-400 text-xs font-semibold mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/10 transition-all duration-200"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div onClick={() => setRemember(!remember)}
                  className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${remember ? 'bg-blue-500 border-blue-500' : 'border-white/20'}`}>
                  {remember && <div className="w-2 h-2 bg-white rounded-sm" />}
                </div>
                <span className="text-slate-400 text-sm group-hover:text-slate-300 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
                Forgot password?
              </button>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-60 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </motion.div>
                ) : (
                  <motion.span key="text" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    Sign In
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-slate-500 text-xs">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <p className="text-center text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
                Register as Student
              </Link>
            </p>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm transition-colors w-fit">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
