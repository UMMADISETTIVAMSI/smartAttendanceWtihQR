import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard' },
  { to: '/student/scan-qr', label: 'Scan QR' },
  { to: '/profile', label: 'Profile' },
];

const facultyLinks = [
  { to: '/faculty/dashboard', label: 'Dashboard' },
  { to: '/faculty/generate-qr', label: 'Generate QR' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/reports', label: 'Reports' },
  { to: '/profile', label: 'Profile' },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/reports', label: 'Reports' },
];

const Sidebar = () => {
  const { user } = useAuth();

  const links =
    user?.role === ROLES.STUDENT ? studentLinks :
    user?.role === ROLES.FACULTY ? facultyLinks :
    adminLinks;

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-gray-200 flex flex-col py-6 px-3 gap-1">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `px-4 py-2 rounded text-sm transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`
          }
        >
          {label}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
