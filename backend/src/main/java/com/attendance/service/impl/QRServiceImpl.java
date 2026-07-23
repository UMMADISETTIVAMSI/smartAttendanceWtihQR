package com.attendance.service.impl;

import com.attendance.entity.*;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.*;
import com.attendance.service.QRService;
import com.attendance.util.QRGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class QRServiceImpl implements QRService {

    private final QRSessionRepository qrSessionRepository;
    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final QRGenerator qrGenerator;

    @Override
    public Map<String, Object> generateQR(String subjectId, String section, Integer period, Integer durationMinutes, String facultyEmail) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        Faculty faculty = facultyRepository.findByEmail(facultyEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        int duration = (durationMinutes != null && durationMinutes > 0) ? durationMinutes : 5;

        String sessionId = UUID.randomUUID().toString();
        String token = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusMinutes(duration);

        QRSession session = QRSession.builder()
                .sessionId(sessionId)
                .token(token)
                .subject(subject)
                .faculty(faculty)
                .section(section)
                .period(period)
                .createdAt(now)
                .expiresAt(expiresAt)
                .active(true)
                .build();

        qrSessionRepository.save(session);

        String qrContent = String.format(
                "{\"sessionId\":\"%s\",\"token\":\"%s\",\"subjectId\":\"%s\",\"facultyId\":\"%s\",\"expiresAt\":\"%s\"}",
                sessionId, token, subject.getId(), faculty.getId(), expiresAt
        );

        try {
            String qrBase64 = qrGenerator.generateQRBase64(qrContent, 300, 300);
            return Map.of(
                    "sessionId", sessionId,
                    "token", token,
                    "qrImage", qrBase64,
                    "expiresAt", expiresAt,
                    "subjectName", subject.getSubjectName(),
                    "durationMinutes", duration
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code");
        }
    }

    @Override
    public QRSession validateToken(String token) {
        QRSession session = qrSessionRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid QR token"));

        if (!session.isActive() || LocalDateTime.now().isAfter(session.getExpiresAt())) {
            throw new IllegalArgumentException("QR code has expired");
        }

        return session;
    }

    @Override
    public List<Map<String, Object>> getScannedStudents(String sessionId) {
        QRSession session = qrSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));

        List<Attendance> records = attendanceRepository.findByQrSession(session);

        // total students in this section
        long totalInSection = studentRepository
                .findByDepartmentIgnoreCaseAndYearAndSectionIgnoreCase(
                        session.getSubject().getDepartment() != null ? session.getSubject().getDepartment() : "",
                        null, session.getSection())
                .size();

        // try to get count from section filter
        List<Student> sectionStudents = studentRepository.findBySection(session.getSection());

        List<Map<String, Object>> scanned = records.stream().map(a -> {
            Map<String, Object> m = new HashMap<>();
            m.put("studentId", a.getStudent().getId());
            m.put("name", a.getStudent().getUser().getName());
            m.put("rollNumber", a.getStudent().getRollNumber());
            m.put("scannedAt", a.getTime().toString());
            return m;
        }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("scanned", scanned);
        result.put("scannedCount", scanned.size());
        result.put("totalInSection", sectionStudents.size());
        result.put("sessionId", sessionId);
        result.put("subjectName", session.getSubject().getSubjectName());
        result.put("section", session.getSection());
        result.put("period", session.getPeriod());
        result.put("active", session.isActive());
        result.put("expiresAt", session.getExpiresAt().toString());

        return List.of(result);
    }

    @Override
    public Map<String, Object> confirmAttendance(String sessionId) {
        QRSession session = qrSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        session.setActive(false);
        qrSessionRepository.save(session);
        long count = attendanceRepository.findByQrSession(session).size();
        return Map.of("message", "Attendance confirmed", "markedCount", count);
    }

    @Override
    public Map<String, Object> cancelAttendance(String sessionId) {
        QRSession session = qrSessionRepository.findBySessionId(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        // delete all attendance records for this session
        List<Attendance> records = attendanceRepository.findByQrSession(session);
        attendanceRepository.deleteAll(records);
        session.setActive(false);
        qrSessionRepository.save(session);
        return Map.of("message", "Attendance cancelled and records deleted");
    }
}
