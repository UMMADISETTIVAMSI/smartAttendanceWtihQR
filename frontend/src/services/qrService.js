import axiosInstance from '../utils/axiosConfig';

export const generateQRApi = (subjectId, section, period) =>
  axiosInstance.post('/qr/generate', null, { params: { subjectId, section, period } });

export const validateQRApi = (token) => axiosInstance.get(`/qr/validate/${token}`);
