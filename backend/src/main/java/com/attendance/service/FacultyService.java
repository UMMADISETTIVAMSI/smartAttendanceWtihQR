package com.attendance.service;

import com.attendance.dto.AttendanceResponse;
import com.attendance.entity.Faculty;
import com.attendance.entity.Student;
import com.attendance.entity.Subject;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface FacultyService {
    Faculty getProfile(String email);
    List<Subject> getAssignedSubjects(String email);
    List<AttendanceResponse> getTodayAttendance(String email, LocalDate date);
    byte[] exportAttendanceToExcel(String subjectId, LocalDate from, LocalDate to);
    List<String> getCoordinatorDepartments();
    List<Student> getStudentsByFilter(String department, Integer year, String section);
    List<Map<String, Object>> getFacultyByDepartment(String department);
}
