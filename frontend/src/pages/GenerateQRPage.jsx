import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import QRGenerator from '../components/QRGenerator';
import Loading from '../components/Loading';
import { generateQRApi } from '../services/qrService';
import axiosInstance from '../utils/axiosConfig';

const GenerateQRPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ subjectId: '', section: '', period: '' });
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance.get('/faculty/subjects').then((r) => setSubjects(r.data));
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setQrData(null);
    try {
      const { data } = await generateQRApi(form.subjectId, form.section, parseInt(form.period));
      setQrData(data);
      toast.success('QR Code generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate QR');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h2 className="text-xl font-bold text-gray-800">Generate QR Code</h2>

      <form onSubmit={handleGenerate} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <select
            required
            value={form.subjectId}
            onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>{s.subjectName} ({s.subjectCode})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
          <input
            required
            value={form.section}
            onChange={(e) => setForm({ ...form, section: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
          <input
            required
            type="number"
            min="1"
            max="8"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? 'Generating...' : 'Generate QR'}
        </button>
      </form>

      {qrData && (
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center gap-2">
          <p className="font-semibold text-gray-700">{qrData.subjectName}</p>
          <QRGenerator
            qrImage={qrData.qrImage}
            expiresAt={qrData.expiresAt}
            onExpire={() => toast('QR expired. Generate a new one.', { icon: '⏰' })}
          />
        </div>
      )}
    </div>
  );
};

export default GenerateQRPage;
