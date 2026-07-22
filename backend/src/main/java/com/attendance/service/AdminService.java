package com.attendance.service;

import com.attendance.dto.AttendanceResponse;
import com.attendance.dto.FacultyCreateRequest;
import com.attendance.dto.FacultyCreateResponse;
import com.attendance.entity.Student;
import com.attendance.entity.Subject;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AdminService {
    long countStudents();
    long countFaculty();
    long countSubjects();
    List<Student> getAllStudents();
    List<FacultyCreateResponse> getAllFaculty();
    List<Subject> getAllSubjects();
    List<AttendanceResponse> getAttendanceByDate(LocalDate date);
    Map<String, Object> getOverallStats();
    FacultyCreateResponse createFaculty(FacultyCreateRequest request);
    List<FacultyCreateResponse> bulkCreateFaculty(MultipartFile file);
    void deleteFaculty(String facultyId);
    void resetFacultyPassword(String facultyId, String newPassword);
}
