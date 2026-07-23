package com.attendance.service;

import com.attendance.dto.*;

import java.util.List;
import java.util.Map;

public interface CoordinatorService {
    // Student management
    Map<String, Object> addStudent(String coordinatorEmail, StudentCreateRequest request);
    List<StudentResponse> getStudents(String coordinatorEmail);
    StudentResponse getStudent(String coordinatorEmail, String studentId);
    StudentResponse updateStudent(String coordinatorEmail, String studentId, StudentCreateRequest request);
    void deleteStudent(String coordinatorEmail, String studentId);
    Map<String, Object> resetStudentPassword(String coordinatorEmail, String studentId);
    Map<String, Object> toggleStudentActive(String coordinatorEmail, String studentId);
    String getCoordinatorDepartment(String coordinatorEmail);
    List<StudentResponse> bulkAddStudents(String coordinatorEmail, org.springframework.web.multipart.MultipartFile file);
}
