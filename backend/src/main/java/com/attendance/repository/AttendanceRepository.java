package com.attendance.repository;

import com.attendance.entity.Attendance;
import com.attendance.entity.Faculty;
import com.attendance.entity.QRSession;
import com.attendance.entity.Student;
import com.attendance.entity.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {

    boolean existsByStudentAndQrSession(Student student, QRSession qrSession);

    List<Attendance> findByStudent(Student student);

    List<Attendance> findByStudentAndSubject(Student student, Subject subject);

    List<Attendance> findBySubjectAndDate(Subject subject, LocalDate date);

    List<Attendance> findByFacultyAndDate(Faculty faculty, LocalDate date);

    List<Attendance> findByStudentAndDateBetween(Student student, LocalDate from, LocalDate to);

    long countByStudentAndSubjectAndStatus(Student student, Subject subject, Attendance.Status status);

    long countByStudentAndSubject(Student student, Subject subject);

    Optional<Attendance> findByStudentAndQrSession(Student student, QRSession qrSession);

    List<Attendance> findByDate(LocalDate date);

    List<Attendance> findByQrSession(QRSession qrSession);
}
