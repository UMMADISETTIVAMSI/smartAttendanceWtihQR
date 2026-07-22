import { motion } from 'framer-motion';
import { QrCode, Mail, MapPin, Phone, ExternalLink } from 'lucide-react';

const Footer = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer id="footer" className="bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <QrCode className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Smart<span className="text-blue-400">QR</span></span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              A modern, paperless attendance management system powered by dynamic QR codes for educational institutions.
            </p>
            <div className="flex gap-3">
              {['GH', 'TW', 'LI', 'IG'].map((label, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.15, y: -2 }}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 text-xs font-bold"
                >
                  {label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', id: 'hero' },
                { label: 'Features', id: 'features' },
                { label: 'How It Works', id: 'how-it-works' },
                { label: 'Login', path: '/login' },
                { label: 'Register', path: '/signup' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => link.id ? scrollTo(link.id) : window.location.href = link.path}
                    className="text-slate-400 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Roles */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Users</h4>
            <ul className="space-y-2.5">
              {['Admin Portal', 'Faculty Portal', 'Student Portal', 'QR Scanner', 'Attendance Reports'].map((item) => (
                <li key={item}>
                  <span className="text-slate-400 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">support@smartqr.edu</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  Department of Computer Science,<br />
                  Engineering College Campus,<br />
                  Bangalore, Karnataka - 560001
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2026 SmartQR Attendance System. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Support'].map((item) => (
              <a key={item} href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
