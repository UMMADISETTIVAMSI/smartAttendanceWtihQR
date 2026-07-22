import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, UserCheck, Building2, ClipboardList, QrCode } from 'lucide-react';

const useCounter = (target, duration = 2000, inView) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
};

const StatCard = ({ icon: Icon, value, suffix, label, gradient, delay, inView }) => {
  const count = useCounter(value, 2000, inView);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300"
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="text-4xl font-extrabold text-white mb-1">
        {count}{suffix}
      </div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
    </motion.div>
  );
};

const stats = [
  { icon: Users, value: 500, suffix: '+', label: 'Students Enrolled', gradient: 'from-blue-500 to-cyan-500', delay: 0 },
  { icon: UserCheck, value: 50, suffix: '+', label: 'Faculty Members', gradient: 'from-purple-500 to-violet-500', delay: 0.1 },
  { icon: Building2, value: 8, suffix: '', label: 'Departments', gradient: 'from-green-500 to-emerald-500', delay: 0.2 },
  { icon: ClipboardList, value: 12000, suffix: '+', label: 'Attendance Records', gradient: 'from-orange-500 to-amber-500', delay: 0.3 },
  { icon: QrCode, value: 1500, suffix: '+', label: 'QR Sessions', gradient: 'from-pink-500 to-rose-500', delay: 0.4 },
];

const Statistics = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 bg-gradient-to-b from-slate-900 to-blue-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-slate-400 text-lg">Real numbers from real institutions using SmartQR.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
