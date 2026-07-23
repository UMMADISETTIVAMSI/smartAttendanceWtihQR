import { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, X, Users, KeyRound, ToggleLeft, ToggleRight, Pencil, Upload, Download, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosConfig';

const emptyForm = { name: '', email: '', rollNumber: '', year: '', section: '' };

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [createdCreds, setCreatedCreds] = useState(null);

  const [bulkResults, setBulkResults] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const fetchStudents = () => {
    setLoading(true);
    axiosInstance.get('/coordinator/students')
      .then(r => setStudents(r.data))
      .catch(() => toast.error('Failed to load students'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setBulkResults(null);
    try {
      const { data } = await axiosInstance.post('/coordinator/students/bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBulkResults(data);
      toast.success(`${data.length} student account${data.length !== 1 ? 's' : ''} created`);
      fetchStudents();
    } catch {
      toast.error('Failed to process Excel file');
    } finally {
      setUploading(false);
      fileRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const headers = ['Name', 'Email', 'Roll Number', 'Year', 'Section'];
    const samples = [
      ['John Doe', 'john.doe@college.edu', '21CS001', 2, 'A'],
      ['Jane Smith', 'jane.smith@college.edu', '21CS002', 2, 'B'],
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers, ...samples]);
    ws['!cols'] = [20, 28, 14, 6, 8].map(w => ({ wch: w }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students_template.xlsx');
  };

  const openAdd = () => { setEditStudent(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (s) => {
    setEditStudent(s);
    setForm({ name: s.name, email: s.email, rollNumber: s.rollNumber, year: s.year || '', section: s.section || '' });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editStudent) {
        await axiosInstance.put(`/coordinator/students/${editStudent.id}`, {
          ...form,
          year: form.year ? parseInt(form.year) : null,
        });
        toast.success('Student updated');
        setShowForm(false);
        fetchStudents();
      } else {
        const { data } = await axiosInstance.post('/coordinator/students', {
          ...form,
          year: form.year ? parseInt(form.year) : null,
        });
        setCreatedCreds({ username: data.username, password: data.password, name: form.name });
        setForm(emptyForm);
        setShowForm(false);
        fetchStudents();
        toast.success(`Student account created for ${form.name}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete student "${name}"?`)) return;
    try {
      await axiosInstance.delete(`/coordinator/students/${id}`);
      toast.success(`${name} removed`);
      fetchStudents();
    } catch { toast.error('Failed to delete student'); }
  };

  const handleResetPassword = async (id, name) => {
    if (!window.confirm(`Reset password for "${name}" to default?`)) return;
    try {
      const { data } = await axiosInstance.post(`/coordinator/students/${id}/reset-password`);
      toast.success(`Password reset to: ${data.password}`);
    } catch { toast.error('Failed to reset password'); }
  };

  const handleToggleActive = async (id) => {
    try {
      const { data } = await axiosInstance.post(`/coordinator/students/${id}/toggle-active`);
      toast.success(data.message);
      fetchStudents();
    } catch { toast.error('Failed to toggle status'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Manage Students</h2>
          <p className="text-slate-400 text-sm mt-1">Create and manage student accounts for your department</p>
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
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold shadow-lg shadow-blue-500/20"
          >
            <UserPlus className="w-4 h-4" /> Add Student
          </motion.button>
        </div>
      </div>

      {/* Created credentials banner */}
      <AnimatePresence>
        {createdCreds && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-green-400 font-semibold">✅ Student account created for {createdCreds.name}</p>
              <button onClick={() => setCreatedCreds(null)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <p className="text-slate-300 text-sm">Share these credentials with the student:</p>
            <div className="mt-2 flex gap-4 flex-wrap">
              <span className="text-xs bg-white/10 px-3 py-1.5 rounded-lg text-white font-mono">Username: {createdCreds.username}</span>
              <span className="text-xs bg-white/10 px-3 py-1.5 rounded-lg text-white font-mono">Password: {createdCreds.password}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
                {bulkResults.length} Student Account{bulkResults.length !== 1 ? 's' : ''} Created
              </div>
              <button onClick={() => setBulkResults(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-slate-400 text-xs mb-3">
              Default password <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">Student@123</span> has been set. Username = Roll Number.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {bulkResults.map((s) => (
                <div key={s.id} className="bg-white/5 rounded-xl px-3 py-3 text-sm space-y-1">
                  <div className="text-white font-semibold">{s.name}</div>
                  <div className="text-slate-300 text-xs">📧 {s.email}</div>
                  <div className="text-slate-400 text-xs font-mono">{s.rollNumber} · Year {s.year} · {s.section}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{editStudent ? 'Edit Student' : 'Add New Student'}</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text' },
                { key: 'email', label: 'Email', placeholder: 'john@college.edu', type: 'email' },
                { key: 'rollNumber', label: 'Roll Number', placeholder: '21CS001', type: 'text', disabled: !!editStudent },
                { key: 'year', label: 'Year', placeholder: '2', type: 'number' },
                { key: 'section', label: 'Section', placeholder: 'A', type: 'text' },
              ].map(({ key, label, placeholder, type, disabled }) => (
                <div key={key}>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">{label}</label>
                  <input
                    type={type} required value={form[key]} disabled={disabled}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-all disabled:opacity-50"
                  />
                </div>
              ))}
              {!editStudent && (
                <div className="sm:col-span-2 bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-2.5 text-xs text-blue-300">
                  Default password <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded">Student@123</span> will be set. Username = Roll Number.
                </div>
              )}
              <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 text-sm font-medium">
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit" disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : editStudent ? 'Update Student' : 'Create Student Account'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Students List */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold">Students</span>
          <span className="ml-auto bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-1 rounded-full">{students.length}</span>
        </div>
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No students added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Name', 'Email', 'Roll No', 'Year', 'Section', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((s) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {s.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-white text-sm font-medium">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-300 text-sm">{s.email}</td>
                    <td className="px-4 py-4 text-slate-300 text-sm font-mono">{s.rollNumber}</td>
                    <td className="px-4 py-4 text-slate-300 text-sm">{s.year || '—'}</td>
                    <td className="px-4 py-4 text-slate-300 text-sm">{s.section || '—'}</td>
                    <td className="px-4 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s.active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {s.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(s)}
                          className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 hover:bg-blue-500/20 transition-all" title="Edit">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleToggleActive(s.id)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all" title="Toggle Active">
                          {s.active ? <ToggleRight className="w-4 h-4 text-green-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                        </button>
                        <button onClick={() => handleResetPassword(s.id, s.name)}
                          className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 hover:bg-yellow-500/20 transition-all" title="Reset Password">
                          <KeyRound className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id, s.name)}
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
      {/* Excel Format Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-300 text-sm font-semibold mb-1">Excel File Format</p>
          <p className="text-slate-400 text-xs">Columns: <span className="text-slate-300 font-mono">Name | Email | Roll Number | Year | Section</span></p>
          <p className="text-slate-400 text-xs mt-1">Default password: <span className="font-mono bg-white/10 px-1.5 py-0.5 rounded text-white">Student@123</span> — Username = Roll Number.</p>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
