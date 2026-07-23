import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROLES } from '../utils/constants';

const studentLinks = [
  { to: '/student/dashboard', label: 'Dashboard' },
  { to: '/student/scan-qr', label: 'Scan QR' },
];

const facultyLinks = [
  { to: '/faculty/dashboard', label: 'Dashboard' },
  { to: '/faculty/my-section', label: 'My Sections' },
  { to: '/faculty/generate-qr', label: 'Generate QR' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/reports', label: 'Reports' },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/faculty', label: 'Manage Faculty' },
  { to: '/admin/coordinators', label: 'Manage Coordinators' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/reports', label: 'Reports' },
];

const coordinatorLinks = [
  { to: '/coordinator/dashboard', label: 'Dashboard' },
  { to: '/coordinator/students', label: 'Manage Students' },
];

const Sidebar = () => {
  const { user } = useAuth();

  const links =
    user?.role === ROLES.STUDENT ? studentLinks :
    user?.role === ROLES.FACULTY ? facultyLinks :
    user?.role === ROLES.COORDINATOR ? coordinatorLinks :
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
