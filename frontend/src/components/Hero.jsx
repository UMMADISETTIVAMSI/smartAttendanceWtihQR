import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, QrCode, Shield, BarChart3, Users, Zap } from 'lucide-react';

const FloatingCard = ({ icon: Icon, label, color, className }) => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    className={`absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-xl ${className}`}
  >
    <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <span className="text-white text-xs font-semibold whitespace-nowrap">{label}</span>
  </motion.div>
);

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950"
    >
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-40 left-1/3 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-6"
          >
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-300 text-xs font-semibold tracking-wide uppercase">
              Next-Gen Attendance System
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
          >
            Smart QR{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Attendance
            </span>{' '}
            Management
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-slate-300 text-lg leading-relaxed mb-10 max-w-lg"
          >
            A secure, fast, and paperless attendance management system using dynamic QR Codes for colleges and universities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all duration-300"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
            >
              Learn More
            </motion.button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex gap-8 mt-12"
          >
            {[
              { value: '500+', label: 'Students' },
              { value: '50+', label: 'Faculty' },
              { value: '99%', label: 'Accuracy' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side — Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center h-[480px]"
        >
          {/* Central QR Card */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
          >
            {/* QR Code Grid */}
            <div className="w-48 h-48 bg-white rounded-2xl p-4 mx-auto mb-4">
              <div className="w-full h-full grid grid-cols-7 gap-0.5">
                {Array.from({ length: 49 }).map((_, i) => {
                  const corners = [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,48];
                  const filled = corners.includes(i) || Math.random() > 0.5;
                  return (
                    <div
                      key={i}
                      className={`rounded-sm ${filled ? 'bg-slate-900' : 'bg-transparent'}`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-sm">Dynamic QR Code</div>
              <div className="text-slate-400 text-xs mt-1">Expires in 5:00 min</div>
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Active Session</span>
              </div>
            </div>
          </motion.div>

          {/* Floating Cards */}
          <FloatingCard
            icon={Users}
            label="42 Students Present"
            color="bg-blue-500"
            className="top-8 -left-4 lg:-left-16"
          />
          <FloatingCard
            icon={Shield}
            label="Verified Attendance"
            color="bg-green-500"
            className="top-8 -right-4 lg:-right-16"
          />
          <FloatingCard
            icon={BarChart3}
            label="Live Analytics"
            color="bg-purple-500"
            className="bottom-16 -left-4 lg:-left-20"
          />
          <FloatingCard
            icon={QrCode}
            label="QR Session Active"
            color="bg-orange-500"
            className="bottom-16 -right-4 lg:-right-16"
          />

          {/* Glow ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 rounded-full border border-blue-500/20 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute w-56 h-56 rounded-full border border-purple-500/20 animate-ping" style={{ animationDuration: '4s' }} />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
