package com.attendance.service;

import com.attendance.entity.QRSession;

import java.util.List;
import java.util.Map;

public interface QRService {
    Map<String, Object> generateQR(String subjectId, String section, Integer period, Integer durationMinutes, String facultyEmail);
    QRSession validateToken(String token);
    List<Map<String, Object>> getScannedStudents(String sessionId);
    Map<String, Object> confirmAttendance(String sessionId);
    Map<String, Object> cancelAttendance(String sessionId);
}
