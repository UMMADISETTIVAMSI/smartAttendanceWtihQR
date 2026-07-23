import axiosInstance from '../utils/axiosConfig';

export const generateQRApi = (subjectId, section, period, durationMinutes = 5) =>
  axiosInstance.post('/qr/generate', null, { params: { subjectId, section, period, durationMinutes } });

export const validateQRApi = (token) => axiosInstance.get(`/qr/validate/${token}`);
