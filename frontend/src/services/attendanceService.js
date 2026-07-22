import axiosInstance from '../utils/axiosConfig';

export const markAttendanceApi = (data) => axiosInstance.post('/attendance/mark', data);
export const getAttendanceBySubjectApi = (subjectId, date) =>
  axiosInstance.get(`/attendance/subject/${subjectId}`, { params: { date } });
export const getAttendanceByStudentApi = (studentId) =>
  axiosInstance.get(`/attendance/student/${studentId}`);
