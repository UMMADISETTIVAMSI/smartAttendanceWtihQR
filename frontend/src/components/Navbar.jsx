import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, Menu, X, ChevronDown, LogOut, User, LayoutDashboard, QrCode as QrIcon, ScanLine, FileBarChart, Users, BookOpen, ClipboardList, UserPlus, Shield, GraduationCap } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import { SECTION_KEY } from '../pages/MySection';

const roleNavLinks = {
  [ROLES.ADMIN]: [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Faculty', path: '/admin/faculty', icon: UserPlus },
    { label: 'Manage Coordinators', path: '/admin/coordinators', icon: Shield },
    { label: 'Attendance', path: '/attendance', icon: ClipboardList },
    { label: 'Reports', path: '/reports', icon: FileBarChart },
    { label: 'Profile', path: '/profile', icon: User },
  ],
  [ROLES.FACULTY]: [
    { label: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { label: 'Generate QR', path: '/faculty/generate-qr', icon: QrIcon },
    { label: 'Attendance', path: '/attendance', icon: ClipboardList },
    { label: 'Reports', path: '/reports', icon: FileBarChart },
    { label: 'Profile', path: '/profile', icon: User },
  ],
  [ROLES.STUDENT]: [
    { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Scan QR', path: '/student/scan-qr', icon: ScanLine },
    { label: 'Attendance', path: '/attendance', icon: ClipboardList },
    { label: 'Reports', path: '/reports', icon: FileBarChart },
    { label: 'Profile', path: '/profile', icon: User },
  ],
  [ROLES.COORDINATOR]: [
    { label: 'Dashboard', path: '/coordinator/dashboard', icon: LayoutDashboard },
    { label: 'Manage Students', path: '/coordinator/students', icon: Users },
    { label: 'Profile', path: '/profile', icon: User },
  ],
};

const roleBadgeColor = {
  [ROLES.ADMIN]: 'from-red-500 to-orange-500',
  [ROLES.FACULTY]: 'from-purple-500 to-blue-500',
  [ROLES.STUDENT]: 'from-green-500 to-teal-500',
  [ROLES.COORDINATOR]: 'from-yellow-500 to-orange-500',
};

const publicNavLinks = [
  { label: 'Home', id: 'hero' },
  { label: 'Features', id: 'features' },
  { label: 'About', id: 'how-it-works' },
  { label: 'Contact', id: 'footer' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sectionBadge, setSectionBadge] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.role === ROLES.FACULTY) {
      const saved = localStorage.getItem(SECTION_KEY);
      const arr = saved ? JSON.parse(saved) : [];
      setSectionBadge(arr.length > 0 ? arr.length : null);
    }
  }, [location, user]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  const navLinks = isAuthenticated ? (roleNavLinks[user?.role] || []) : [];
  const facultyLinks = user?.role === ROLES.FACULTY ? [
    { label: 'Dashboard', path: '/faculty/dashboard', icon: LayoutDashboard },
    { label: 'My Sections', path: '/faculty/my-section', icon: GraduationCap, badge: sectionBadge ? `${sectionBadge}` : null },
    { label: 'Generate QR', path: '/faculty/generate-qr', icon: QrIcon },
    { label: 'Attendance', path: '/attendance', icon: ClipboardList },
    { label: 'Reports', path: '/reports', icon: FileBarChart },
    { label: 'Profile', path: '/profile', icon: User },
  ] : null;
  const activeLinks = facultyLinks || navLinks;
  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isAuthenticated
          ? 'bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => isAuthenticated ? navigate(activeLinks[0]?.path || '/') : scrollTo('hero')}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Smart<span className="text-blue-400">QR</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {isAuthenticated ? (
            activeLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'bg-white/15 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                {link.badge && (
                  <span className="ml-1 bg-green-500/20 border border-green-500/30 text-green-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            ))
          ) : (
            publicNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className="px-4 py-2 text-white/80 hover:text-white text-sm font-medium transition-colors duration-200 rounded-lg hover:bg-white/10"
              >
                {link.label}
              </button>
            ))
          )}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-full pl-1 pr-3 py-1 hover:bg-white/15 transition-all duration-200"
              >
                <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${roleBadgeColor[user?.role]} flex items-center justify-center text-white text-xs font-bold`}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="text-white text-xs font-semibold leading-none">{user?.name}</div>
                  <div className="text-white/50 text-[10px] leading-none mt-0.5">{user?.role}</div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-48 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <div className="text-white text-sm font-semibold">{user?.name}</div>
                      <div className="text-slate-400 text-xs">{user?.email}</div>
                      <div className={`inline-flex mt-1.5 px-2 py-0.5 rounded-full bg-gradient-to-r ${roleBadgeColor[user?.role]} text-white text-[10px] font-bold`}>
                        {user?.role}
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => { navigate('/profile'); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-white/10 text-sm transition-colors duration-150"
                      >
                        <User className="w-4 h-4" /> Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm transition-colors duration-150"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
            >
              Login
            </motion.button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {isAuthenticated ? (
                <>
                  {/* User info */}
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/10">
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${roleBadgeColor[user?.role]} flex items-center justify-center text-white text-sm font-bold`}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white text-sm font-semibold">{user?.name}</div>
                      <div className="text-slate-400 text-xs">{user?.role}</div>
                    </div>
                  </div>
                  {activeLinks.map((link) => (
                    <button
                      key={link.path}
                      onClick={() => { navigate(link.path); setMenuOpen(false); }}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive(link.path) ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                      {link.badge && (
                        <span className="ml-1 bg-green-500/20 border border-green-500/30 text-green-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {link.badge}
                        </span>
                      )}
                    </button>
                  ))}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 mt-2"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  {publicNavLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => scrollTo(link.id)}
                      className="px-3 py-2.5 text-white/80 hover:text-white text-sm font-medium text-left rounded-lg hover:bg-white/10"
                    >
                      {link.label}
                    </button>
                  ))}
                  <button
                    onClick={() => { setMenuOpen(false); navigate('/login'); }}
                    className="mt-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold w-fit"
                  >
                    Login
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
