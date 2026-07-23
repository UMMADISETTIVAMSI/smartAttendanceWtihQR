import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, X, Users, KeyRound, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosConfig';

const emptyForm = { name: '', email: '', username: '', mobile: '', department: '' };

const ManageCoordinators = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [createdCreds, setCreatedCreds] = useState(null);

  const fetchCoordinators = () => {
    setLoading(true);
    axiosInstance.get('/admin/coordinators')
      .then(r => setCoordinators(r.data))
      .catch(() => toast.error('Failed to load coordinators'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoordinators(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axiosInstance.post('/admin/coordinators', form);
      setCreatedCreds({ username: data.username, password: data.password, name: form.name });
      setForm(emptyForm);
      setShowForm(false);
      fetchCoordinators();
      toast.success(`Coordinator account created for ${form.name}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coordinator');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete coordinator "${name}"?`)) return;
    try {
      await axiosInstance.delete(`/admin/coordinators/${id}`);
      toast.success(`${name} removed`);
      fetchCoordinators();
    } catch { toast.error('Failed to delete coordinator'); }
  };

  const handleResetPassword = async (id, name) => {
    if (!window.confirm(`Reset password for "${name}" to default?`)) return;
    try {
      const { data } = await axiosInstance.post(`/admin/coordinators/${id}/reset-password`);
      toast.success(`Password reset. New password: ${data.password}`);
    } catch { toast.error('Failed to reset password'); }
  };

  const handleToggleActive = async (id) => {
    try {
      const { data } = await axiosInstance.post(`/admin/coordinators/${id}/toggle-active`);
      toast.success(data.active ? 'Coordinator activated' : 'Coordinator deactivated');
      fetchCoordinators();
    } catch { toast.error('Failed to toggle status'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Coordinators</h2>
          <p className="text-slate-400 text-sm mt-1">Create and manage department coordinator accounts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/20"
        >
          <UserPlus className="w-4 h-4" /> Add Coordinator
        </motion.button>
      </div>

      {/* Created credentials banner */}
      <AnimatePresence>
        {createdCreds && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-400 font-semibold">✅ Coordinator account created for {createdCreds.name}</p>
              <button onClick={() => setCreatedCreds(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-slate-300 text-sm">Share these credentials with the coordinator:</p>
            <div className="mt-2 flex gap-4 flex-wrap">
              <span className="text-xs bg-white/10 px-3 py-1.5 rounded-lg text-white font-mono">Username: {createdCreds.username}</span>
              <span className="text-xs bg-white/10 px-3 py-1.5 rounded-lg text-white font-mono">Password: {createdCreds.password}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">Add New Coordinator</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Dr. Jane Doe', type: 'text' },
                { key: 'email', label: 'Email', placeholder: 'jane@college.edu', type: 'email' },
                { key: 'username', label: 'Username', placeholder: 'jane_doe', type: 'text' },
                { key: 'mobile', label: 'Mobile', placeholder: '9876543210', type: 'text' },
                { key: 'department', label: 'Department', placeholder: 'Computer Science', type: 'text' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
                  <input
                    type={type} required value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              ))}
              <div className="sm:col-span-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2.5 text-xs text-blue-300">
                Default password <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">Coordinator@123</span> will be set.
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-sm font-medium">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {submitting ? 'Creating...' : 'Create Coordinator Account'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coordinators List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-400" />
          <span className="text-white font-semibold">Coordinators</span>
          <span className="ml-auto bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full">{coordinators.length}</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : coordinators.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No coordinators added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Name', 'Email', 'Username', 'Department', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {coordinators.map((c) => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {c.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-white text-sm font-medium">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{c.email}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm font-mono">{c.username}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{c.department}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleToggleActive(c.id)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all" title="Toggle Active">
                          {c.active ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                        </button>
                        <button onClick={() => handleResetPassword(c.id, c.name)}
                          className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 transition-all" title="Reset Password">
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id, c.name)}
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCoordinators;
