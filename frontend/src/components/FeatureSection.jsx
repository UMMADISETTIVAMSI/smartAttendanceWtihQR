import { motion } from 'framer-motion';
import {
  QrCode, Shield, LayoutDashboard, GraduationCap,
  UserCheck, FileBarChart, Radio, Zap, BookOpen, BarChart3
} from 'lucide-react';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: QrCode,
    title: 'Dynamic QR Generation',
    description: 'Generate time-limited, session-specific QR codes that expire automatically to prevent misuse.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Secure Attendance',
    description: 'JWT-based authentication with role-based access control ensures data security at every level.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: LayoutDashboard,
    title: 'Admin Dashboard',
    description: 'Full control over users, departments, subjects, and system-wide attendance analytics.',
    gradient: 'from-purple-500 to-violet-500',
  },
  {
    icon: UserCheck,
    title: 'Faculty Dashboard',
    description: 'Faculty can generate QR sessions, monitor live attendance, and manage their subjects.',
    gradient: 'from-orange-500 to-amber-500',
  },
  {
    icon: GraduationCap,
    title: 'Student Dashboard',
    description: 'Students can scan QR codes, view their attendance history, and track their percentage.',
    gradient: 'from-pink-500 to-rose-500',
  },
  {
    icon: FileBarChart,
    title: 'Attendance Reports',
    description: 'Export detailed attendance reports in PDF or Excel format for any date range or subject.',
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Radio,
    title: 'Live Attendance',
    description: 'Real-time attendance tracking — see who marked attendance the moment they scan.',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Fast QR Scanning',
    description: 'Instant QR code scanning using device camera with real-time validation and feedback.',
    gradient: 'from-yellow-500 to-orange-500',
  },
  {
    icon: BookOpen,
    title: 'Subject Management',
    description: 'Admins can create and assign subjects to faculty across departments and semesters.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: BarChart3,
    title: 'Attendance Analytics',
    description: 'Visual charts and graphs showing attendance trends, defaulters, and subject-wise stats.',
    gradient: 'from-violet-500 to-purple-500',
  },
];

const FeatureSection = () => (
  <section id="features" className="py-24 bg-gradient-to-b from-slate-900 to-blue-950">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 rounded-full px-4 py-1.5 mb-4">
          <Zap className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-blue-300 text-xs font-semibold tracking-wide uppercase">Features</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
          Everything You{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Need
          </span>
        </h2>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          A complete attendance management solution built for modern educational institutions.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} {...feature} delay={i * 0.07} />
        ))}
      </div>
    </div>
  </section>
);

export default FeatureSection;
