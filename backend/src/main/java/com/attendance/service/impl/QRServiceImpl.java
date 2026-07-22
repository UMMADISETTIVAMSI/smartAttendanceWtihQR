package com.attendance.service.impl;

import com.attendance.entity.Faculty;
import com.attendance.entity.QRSession;
import com.attendance.entity.Subject;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.FacultyRepository;
import com.attendance.repository.QRSessionRepository;
import com.attendance.repository.SubjectRepository;
import com.attendance.service.QRService;
import com.attendance.util.QRGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QRServiceImpl implements QRService {

    private final QRSessionRepository qrSessionRepository;
    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;
    private final QRGenerator qrGenerator;

    @Override
    public Map<String, Object> generateQR(String subjectId, String section, Integer period, String facultyEmail) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        Faculty faculty = facultyRepository.findByEmail(facultyEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));

        String sessionId = UUID.randomUUID().toString();
        String token = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusSeconds(30);

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
                    "subjectName", subject.getSubjectName()
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
}
