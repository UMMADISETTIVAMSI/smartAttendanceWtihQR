import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardLayout = () => (
  <div className="min-h-screen bg-slate-950">
    <Navbar />
    <main className="pt-20 px-6 pb-8 max-w-7xl mx-auto">
      <Outlet />
    </main>
  </div>
);

export default DashboardLayout;
