import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const QRGenerator = ({ qrImage, expiresAt, onExpire }) => {
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    if (!expiresAt) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
      setSecondsLeft(diff);
      if (diff === 0) { clearInterval(interval); onExpire?.(); }
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!qrImage) return null;

  const isExpired = secondsLeft === 0;
  const isUrgent = secondsLeft <= 10 && !isExpired;
  const pct = Math.min((secondsLeft / 30) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className={`relative p-3 rounded-2xl border-2 transition-all ${isExpired ? 'border-red-500/50 opacity-50' : isUrgent ? 'border-red-500/70' : 'border-blue-500/50'}`}>
        <img
          src={`data:image/png;base64,${qrImage}`}
          alt="QR Code"
          className="w-56 h-56 rounded-xl"
        />
        {isExpired && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl">
            <p className="text-red-400 font-bold text-lg">Expired</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-56 space-y-1.5">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full transition-colors ${isExpired ? 'bg-red-500' : isUrgent ? 'bg-orange-500' : 'bg-green-500'}`}
          />
        </div>
        <p className={`text-center text-sm font-bold ${isExpired ? 'text-red-400' : isUrgent ? 'text-orange-400' : 'text-green-400'}`}>
          {isExpired ? 'QR Expired — Generate a new one' : `Expires in ${secondsLeft}s`}
        </p>
      </div>
    </div>
  );
};

export default QRGenerator;
