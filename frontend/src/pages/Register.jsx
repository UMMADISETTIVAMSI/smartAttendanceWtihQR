import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerApi } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'STUDENT',
    rollNumber: '', department: '', semester: '', section: '',
    employeeId: '', designation: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerApi(form);
      toast.success('Registered successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, key, type = 'text', placeholder = '') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {field('Full Name', 'name', 'text', 'John Doe')}
          {field('Email', 'email', 'email', 'you@example.com')}
          {field('Password', 'password', 'password', '••••••••')}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="STUDENT">Student</option>
              <option value="FACULTY">Faculty</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {form.role === 'STUDENT' && (
            <>
              {field('Roll Number', 'rollNumber', 'text', 'CS2021001')}
              {field('Department', 'department', 'text', 'Computer Science')}
              {field('Semester', 'semester', 'number', '3')}
              {field('Section', 'section', 'text', 'A')}
            </>
          )}

          {form.role === 'FACULTY' && (
            <>
              {field('Employee ID', 'employeeId', 'text', 'FAC001')}
              {field('Department', 'department', 'text', 'Computer Science')}
              {field('Designation', 'designation', 'text', 'Assistant Professor')}
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
