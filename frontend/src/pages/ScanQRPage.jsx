import { useState } from 'react';
import toast from 'react-hot-toast';
import QRScanner from '../components/QRScanner';
import { markAttendanceApi } from '../services/attendanceService';

const ScanQRPage = () => {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(true);

  const handleScan = async (decodedText) => {
    setScanning(false);
    try {
      const parsed = JSON.parse(decodedText);
      const { data } = await markAttendanceApi({ token: parsed.token });
      setResult({ success: true, message: `Attendance marked for ${data.subjectName}` });
      toast.success('Attendance marked successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to mark attendance';
      setResult({ success: false, message: msg });
      toast.error(msg);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-800">Scan QR Code</h2>

      {scanning && (
        <div className="bg-white rounded-xl shadow p-6">
          <p className="text-sm text-gray-500 mb-4 text-center">Point your camera at the QR code displayed by your faculty.</p>
          <QRScanner onScan={handleScan} />
        </div>
      )}

      {result && (
        <div className={`rounded-xl p-6 text-center shadow ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          <p className="text-2xl mb-2">{result.success ? '✅' : '❌'}</p>
          <p className="font-semibold">{result.message}</p>
          <button
            onClick={() => { setResult(null); setScanning(true); }}
            className="mt-4 text-sm underline"
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ScanQRPage;
