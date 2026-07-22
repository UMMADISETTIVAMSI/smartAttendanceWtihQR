import { motion } from 'framer-motion';
import { LogIn, QrCode, UserCheck, ScanLine, ShieldCheck, Database, FileText } from 'lucide-react';

const steps = [
  { icon: LogIn, title: 'Faculty Login', description: 'Faculty logs in securely using their credentials provided by Admin.', color: 'from-blue-500 to-cyan-500' },
  { icon: QrCode, title: 'Generate Dynamic QR', description: 'Faculty generates a time-limited QR code for the current class session.', color: 'from-purple-500 to-blue-500' },
  { icon: UserCheck, title: 'Student Login', description: 'Students log in to the system using their registered credentials.', color: 'from-pink-500 to-purple-500' },
  { icon: ScanLine, title: 'Scan QR Code', description: 'Students scan the QR code displayed by the faculty using their device camera.', color: 'from-orange-500 to-pink-500' },
  { icon: ShieldCheck, title: 'Attendance Verification', description: 'System verifies the QR token, session validity, and student identity.', color: 'from-green-500 to-teal-500' },
  { icon: Database, title: 'Attendance Stored', description: 'Verified attendance is securely stored in the database with timestamp.', color: 'from-teal-500 to-cyan-500' },
  { icon: FileText, title: 'Reports Generated', description: 'Admin and Faculty can view, filter, and export attendance reports anytime.', color: 'from-indigo-500 to-purple-500' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 bg-gradient-to-b from-blue-950 to-slate-900">
    <div className="max-w-4xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-400/30 rounded-full px-4 py-1.5 mb-4">
          <ScanLine className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-purple-300 text-xs font-semibold tracking-wide uppercase">How It Works</span>
        </div>
        <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
          Simple{' '}
          <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            7-Step
          </span>{' '}
          Process
        </h2>
        <p className="text-slate-400 text-lg">From login to report — the entire flow in seconds.</p>
      </motion.div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-500 opacity-30" />

        <div className="space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex items-start gap-6 group"
            >
              {/* Icon */}
              <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <step.icon className="w-7 h-7 text-white" />
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 border-2 border-white/20 flex items-center justify-center">
                  <span className="text-white text-[9px] font-bold">{i + 1}</span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                <h3 className="text-white font-bold text-base mb-1">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;
