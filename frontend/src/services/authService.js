import axiosInstance from '../utils/axiosConfig';

export const loginApi = (data) => axiosInstance.post('/auth/login', data);
export const registerApi = (data) => axiosInstance.post('/auth/register', data);
export const changePasswordApi = (data) => axiosInstance.post('/auth/change-password', data);
