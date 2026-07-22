package com.attendance.service;

import com.attendance.dto.AttendanceRequest;
import com.attendance.dto.AttendanceResponse;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    AttendanceResponse markAttendance(AttendanceRequest request, String studentEmail);
    List<AttendanceResponse> getBySubjectAndDate(String subjectId, LocalDate date);
    List<AttendanceResponse> getByStudent(String studentId);
}
