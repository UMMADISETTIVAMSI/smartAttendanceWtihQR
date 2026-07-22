import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QRScanner = ({ onScan }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: 250 }, false);

    scanner.render(
      (decodedText) => {
        scanner.clear();
        onScan(decodedText);
      },
      (error) => console.warn('QR scan error:', error)
    );

    scannerRef.current = scanner;
    return () => scanner.clear().catch(() => {});
  }, []);

  return <div id="qr-reader" className="w-full max-w-sm mx-auto" />;
};

export default QRScanner;
