package com.attendance.service;

import com.attendance.dto.AttendanceResponse;
import com.attendance.entity.Student;

import java.util.List;
import java.util.Map;

public interface StudentService {
    Student getProfile(String email);
    List<AttendanceResponse> getAttendanceHistory(String email);
    List<Map<String, Object>> getSubjectWiseAttendance(String email);
    Map<String, Object> getAttendanceSummary(String email);
}
