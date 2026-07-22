import { useEffect, useState } from 'react';

const QRGenerator = ({ qrImage, expiresAt, onExpire }) => {
  const [secondsLeft, setSecondsLeft] = useState(30);

  useEffect(() => {
    if (!expiresAt) return;

    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt) - Date.now()) / 1000));
      setSecondsLeft(diff);
      if (diff === 0) {
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!qrImage) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <img
        src={`data:image/png;base64,${qrImage}`}
        alt="QR Code"
        className="w-64 h-64 border-4 border-blue-500 rounded-lg shadow-lg"
      />
      <div className={`text-2xl font-bold ${secondsLeft <= 10 ? 'text-red-500' : 'text-green-600'}`}>
        {secondsLeft > 0 ? `Expires in ${secondsLeft}s` : 'QR Expired'}
      </div>
    </div>
  );
};

export default QRGenerator;
