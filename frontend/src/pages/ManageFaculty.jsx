import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Upload, Trash2, X, Download, Users, CheckCircle, AlertCircle, KeyRound, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosConfig';

const emptyForm = { name: '', email: '', department: '', designation: '' };

const ManageFaculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [bulkResults, setBulkResults] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [resetState, setResetState] = useState({});
  const fileRef = useRef();

  const fetchFaculty = () => {
    setLoading(true);
    axiosInstance.get('/admin/faculty')
      .then(r => setFaculty(r.data))
      .catch(() => toast.error('Failed to load faculty'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchFaculty(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/admin/faculty', form);
      toast.success(`Faculty account created for ${form.name}`);
      setForm(emptyForm);
      setShowForm(false);
      fetchFaculty();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create faculty');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete faculty "${name}"? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/admin/faculty/${id}`);
      toast.success(`${name} removed`);
      fetchFaculty();
    } catch {
      toast.error('Failed to delete faculty');
    }
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setBulkResults(null);
    try {
      const { data } = await axiosInstance.post('/admin/faculty/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBulkResults(data);
      toast.success(`${data.length} faculty account${data.length !== 1 ? 's' : ''} created`);
      fetchFaculty();
    } catch {
      toast.error('Failed to process Excel file');
    } finally {
      setUploading(false);
      fileRef.current.value = '';
    }
  };

  const toggleReset = (id) =>
    setResetState(s => ({ ...s, [id]: { pwd: '', show: false, saving: false, ...s[id], open: !s[id]?.open } }));

  const handleResetPassword = async (id) => {
    const pwd = resetState[id]?.pwd;
    if (!pwd || pwd.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setResetState(s => ({ ...s, [id]: { ...s[id], saving: true } }));
    try {
      await axiosInstance.post(`/admin/faculty/${id}/reset-password`, { password: pwd });
      toast.success('Password reset successfully');
      setResetState(s => ({ ...s, [id]: { pwd: '', show: false, saving: false, open: false } }));
    } catch {
      toast.error('Failed to reset password');
      setResetState(s => ({ ...s, [id]: { ...s[id], saving: false } }));
    }
  };

  const downloadTemplate = () => {
    const headers = ['Name', 'Email', 'Department', 'Designation'];
    const samples = [
      ['Dr. John Smith',   'john.smith@college.edu',   'Computer Science',      'Professor'],
      ['Dr. Priya Sharma', 'priya.sharma@college.edu', 'Electronics',           'Associate Professor'],
      ['Mr. Ravi Kumar',   'ravi.kumar@college.edu',   'Mechanical Engineering','Assistant Professor'],
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, ...samples]);
    ws['!cols'] = [28, 32, 26, 24].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Faculty');
    XLSX.writeFile(wb, 'faculty_template.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Faculty</h2>
          <p className="text-slate-400 text-sm mt-1">Create and manage faculty accounts</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={downloadTemplate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-sm font-medium transition-all"
          >
            <Download className="w-4 h-4" /> Download Template
          </motion.button>

          <label className={`flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 text-sm font-medium cursor-pointer transition-all ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Bulk Upload Excel'}
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleBulkUpload} />
          </label>

          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add Faculty
          </motion.button>
        </div>
      </div>

      {/* Bulk Upload Results */}
      <AnimatePresence>
        {bulkResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-green-400 font-semibold">
                <CheckCircle className="w-5 h-5" />
                {bulkResults.length} Faculty Account{bulkResults.length !== 1 ? 's' : ''} Created
              </div>
              <button onClick={() => setBulkResults(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-400 text-xs mb-3">
              Default password <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">faculty@123</span> has been set for all accounts.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {bulkResults.map((f) => (
                <div key={f.id} className="bg-white/5 rounded-xl px-3 py-3 text-sm space-y-1">
                  <div className="text-white font-semibold">{f.name}</div>
                  <div className="text-slate-300 text-xs">📧 {f.email}</div>
                  <div className="text-slate-400 text-xs">{f.department} · {f.designation}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Faculty Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">Add New Faculty</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'Dr. John Smith', type: 'text' },
                { key: 'email', label: 'Email', placeholder: 'john@college.edu', type: 'email' },
                { key: 'department', label: 'Department', placeholder: 'Computer Science', type: 'text' },
                { key: 'designation', label: 'Designation', placeholder: 'Professor', type: 'text' },
              ].map(({ key, label, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
                  <input
                    type={type} required value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              ))}
              <div className="sm:col-span-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2.5 text-xs text-blue-300">
                Default password <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">faculty@123</span> will be set. Faculty can change it from the login page.
              </div>
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-sm font-medium transition-all">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold disabled:opacity-60 transition-all"
                >
                  {submitting ? 'Creating...' : 'Create Faculty Account'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Faculty List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold">Faculty Members</span>
          <span className="ml-auto bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">{faculty.length}</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : faculty.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No faculty added yet. Add one above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Name', 'Email', 'Department', 'Designation', 'Reset Password', 'Action'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {faculty.map((f) => (
                  <motion.tr key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(f.user?.name || f.name)?.charAt(0) || '?'}
                        </div>
                        <span className="text-white text-sm font-medium">{f.user?.name || f.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{f.user?.email || f.email}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{f.department}</td>
                    <td className="px-6 py-4 text-slate-300 text-sm">{f.designation || '—'}</td>
                    <td className="px-4 py-4">
                      {resetState[f.id]?.open ? (
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <input
                              type={resetState[f.id]?.show ? 'text' : 'password'}
                              value={resetState[f.id]?.pwd || ''}
                              onChange={e => setResetState(s => ({ ...s, [f.id]: { ...s[f.id], pwd: e.target.value } }))}
                              placeholder="New password"
                              className="bg-white/5 border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs w-36 focus:outline-none focus:border-blue-500/50 pr-8"
                            />
                            <button type="button"
                              onClick={() => setResetState(s => ({ ...s, [f.id]: { ...s[f.id], show: !s[f.id]?.show } }))}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                              {resetState[f.id]?.show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                          <button onClick={() => handleResetPassword(f.id)} disabled={resetState[f.id]?.saving}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 text-xs font-medium disabled:opacity-50">
                            {resetState[f.id]?.saving ? '...' : 'Save'}
                          </button>
                          <button onClick={() => toggleReset(f.id)} className="text-slate-400 hover:text-white">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => toggleReset(f.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 text-xs font-medium transition-all">
                          <KeyRound className="w-3.5 h-3.5" /> Reset
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(f.id, f.user?.name || f.name)}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Excel Format Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-300 text-sm font-semibold mb-1">Excel File Format</p>
          <p className="text-slate-400 text-xs">Columns: <span className="text-slate-300 font-mono">Name | Email | Department | Designation</span></p>
          <p className="text-slate-400 text-xs mt-1">Default password: <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">faculty@123</span> — faculty can change it from the login page.</p>
        </div>
      </div>
    </div>
  );
};

export default ManageFaculty;
