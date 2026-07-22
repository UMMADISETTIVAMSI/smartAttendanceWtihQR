package com.attendance.repository;

import com.attendance.entity.Faculty;
import com.attendance.entity.QRSession;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface QRSessionRepository extends MongoRepository<QRSession, String> {
    Optional<QRSession> findByToken(String token);
    Optional<QRSession> findBySessionId(String sessionId);
    List<QRSession> findByFacultyAndActiveTrue(Faculty faculty);
    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
