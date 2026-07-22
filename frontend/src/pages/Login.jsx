import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '../hooks/useAuth';
import { loginApi, changePasswordApi } from '../services/authService';
import { getRoleRedirect } from '../utils/helpers';

const Login = () => {
  const [tab, setTab] = useState('login'); // 'login' | 'change'
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [changeForm, setChangeForm] = useState({ email: '', oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState({ login: false, old: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const togglePwd = (key) => setShowPwd(p => ({ ...p, [key]: !p[key] }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginApi(loginForm);
      login({ name: data.name, email: data.email, role: data.role, id: data.id }, data.token);
      toast.success(`Welcome, ${data.name}!`);
      navigate(getRoleRedirect(data.role));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (changeForm.newPassword !== changeForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (changeForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await changePasswordApi({
        email: changeForm.email,
        oldPassword: changeForm.oldPassword,
        newPassword: changeForm.newPassword,
      });
      toast.success('Password changed successfully! Please login.');
      setChangeForm({ email: '', oldPassword: '', newPassword: '', confirmPassword: '' });
      setTab('login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">SmartAttendance QR</h2>
        <p className="text-center text-gray-500 text-sm mb-6">
          {tab === 'login' ? 'Sign in to your account' : 'Change your password'}
        </p>

        {/* Tabs */}
        <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
          {[['login', 'Sign In'], ['change', 'Change Password']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                tab === key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" required value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                className={inputClass} placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPwd.login ? 'text' : 'password'} required value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  className={inputClass + ' pr-10'} placeholder="••••••••"
                />
                <button type="button" onClick={() => togglePwd('login')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd.login ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-2">
              Faculty default password: <span className="font-mono font-semibold text-gray-600">faculty@123</span>
            </p>
          </form>
        )}

        {/* Change Password Form */}
        {tab === 'change' && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email" required value={changeForm.email}
                onChange={e => setChangeForm({ ...changeForm, email: e.target.value })}
                className={inputClass} placeholder="your@email.com"
              />
            </div>
            {[
              { key: 'old', field: 'oldPassword', label: 'Current Password', placeholder: 'Current password' },
              { key: 'new', field: 'newPassword', label: 'New Password', placeholder: 'Min 6 characters' },
              { key: 'confirm', field: 'confirmPassword', label: 'Confirm New Password', placeholder: 'Repeat new password' },
            ].map(({ key, field, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={showPwd[key] ? 'text' : 'password'} required
                    value={changeForm[field]}
                    onChange={e => setChangeForm({ ...changeForm, [field]: e.target.value })}
                    className={inputClass + ' pr-10'} placeholder={placeholder}
                  />
                  <button type="button" onClick={() => togglePwd(key)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60">
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
