package com.attendance.service;

import com.attendance.entity.QRSession;

import java.util.Map;

public interface QRService {
    Map<String, Object> generateQR(String subjectId, String section, Integer period, String facultyEmail);
    QRSession validateToken(String token);
}
