import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, CheckCircle, XCircle, ScanLine } from 'lucide-react';
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
      setResult({ success: true, message: `Attendance marked for ${data.subjectName}`, subject: data.subjectName });
      toast.success('Attendance marked successfully!');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to mark attendance';
      setResult({ success: false, message: msg });
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Scan QR Code</h2>
        <p className="text-slate-400 text-sm mt-1">Point your camera at the QR code shown by your faculty</p>
      </div>

      <AnimatePresence mode="wait">
        {scanning && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <ScanLine className="w-5 h-5 text-blue-400" />
              <p className="text-white font-semibold">Camera Scanner</p>
            </div>
            <p className="text-slate-400 text-sm">Make sure the QR code is clearly visible and well-lit.</p>
            <div className="rounded-xl overflow-hidden border border-white/10">
              <QRScanner onScan={handleScan} />
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`rounded-2xl p-8 text-center border ${
              result.success
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            {result.success
              ? <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
              : <XCircle className="w-14 h-14 text-red-400 mx-auto mb-4" />
            }
            <p className={`text-lg font-bold mb-1 ${result.success ? 'text-green-300' : 'text-red-300'}`}>
              {result.success ? 'Attendance Marked!' : 'Failed'}
            </p>
            <p className="text-slate-400 text-sm">{result.message}</p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => { setResult(null); setScanning(true); }}
              className="mt-6 flex items-center gap-2 mx-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-semibold"
            >
              <QrCode className="w-4 h-4" /> Scan Again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScanQRPage;
