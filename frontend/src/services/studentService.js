import axiosInstance from '../utils/axiosConfig';

export const getStudentProfileApi = () => axiosInstance.get('/student/profile');
export const getAttendanceHistoryApi = () => axiosInstance.get('/student/attendance/history');
export const getSubjectWiseAttendanceApi = () => axiosInstance.get('/student/attendance/subject-wise');
export const getAttendanceSummaryApi = () => axiosInstance.get('/student/attendance/summary');
