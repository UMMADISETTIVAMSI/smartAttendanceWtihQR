import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../layouts/DashboardLayout';
import MainLayout from '../layouts/MainLayout';
import { ROLES } from '../utils/constants';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import StudentDashboard from '../pages/StudentDashboard';
import FacultyDashboard from '../pages/FacultyDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ManageFaculty from '../pages/ManageFaculty';
import GenerateQRPage from '../pages/GenerateQRPage';
import ScanQRPage from '../pages/ScanQRPage';
import AttendancePage from '../pages/AttendancePage';
import Reports from '../pages/Reports';
import Profile from '../pages/Profile';

const AppRoutes = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
    </Route>

    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]}><DashboardLayout /></ProtectedRoute>}>
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/scan-qr" element={<ScanQRPage />} />
    </Route>

    <Route element={<ProtectedRoute allowedRoles={[ROLES.FACULTY]}><DashboardLayout /></ProtectedRoute>}>
      <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
      <Route path="/faculty/generate-qr" element={<GenerateQRPage />} />
    </Route>

    <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]}><DashboardLayout /></ProtectedRoute>}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/faculty" element={<ManageFaculty />} />
    </Route>

    <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.FACULTY, ROLES.STUDENT]}><DashboardLayout /></ProtectedRoute>}>
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/profile" element={<Profile />} />
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default AppRoutes;
