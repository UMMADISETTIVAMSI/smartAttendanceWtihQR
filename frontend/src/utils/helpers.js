import { ROLES, ROUTES } from './constants';

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const formatTime = (time) => {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
};

export const getAttendanceColor = (percentage) => {
  if (percentage >= 75) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getRoleRedirect = (role) => {
  switch (role) {
    case ROLES.ADMIN: return ROUTES.ADMIN_DASHBOARD;
    case ROLES.FACULTY: return ROUTES.FACULTY_DASHBOARD;
    case ROLES.STUDENT: return ROUTES.STUDENT_DASHBOARD;
    default: return ROUTES.LOGIN;
  }
};
