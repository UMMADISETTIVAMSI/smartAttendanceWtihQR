package com.attendance.service.impl;

import com.attendance.dto.AttendanceRequest;
import com.attendance.dto.AttendanceResponse;
import com.attendance.entity.Attendance;
import com.attendance.entity.QRSession;
import com.attendance.entity.Student;
import com.attendance.entity.User;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.repository.UserRepository;
import com.attendance.service.AttendanceService;
import com.attendance.service.QRService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final QRService qrService;

    @Override
    public AttendanceResponse markAttendance(AttendanceRequest request, String studentEmail) {
        User user = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Student student = studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        QRSession session = qrService.validateToken(request.getToken());

        if (attendanceRepository.existsByStudentAndQrSession(student, session)) {
            throw new IllegalArgumentException("Attendance already marked for this session");
        }

        Attendance attendance = Attendance.builder()
                .student(student)
                .subject(session.getSubject())
                .faculty(session.getFaculty())
                .qrSession(session)
                .date(LocalDate.now())
                .time(LocalTime.now())
                .status(Attendance.Status.PRESENT)
                .deviceId(request.getDeviceId())
                .location(request.getLocation())
                .build();

        attendanceRepository.save(attendance);
        return mapToResponse(attendance);
    }

    @Override
    public List<AttendanceResponse> getBySubjectAndDate(String subjectId, LocalDate date) {
        return List.of();
    }

    @Override
    public List<AttendanceResponse> getByStudent(String studentId) {
        return List.of();
    }

    private AttendanceResponse mapToResponse(Attendance a) {
        return AttendanceResponse.builder()
                .id(a.getId())
                .studentName(a.getStudent().getUser().getName())
                .rollNumber(a.getStudent().getRollNumber())
                .subjectName(a.getSubject().getSubjectName())
                .subjectCode(a.getSubject().getSubjectCode())
                .facultyName(a.getFaculty().getName())
                .date(a.getDate())
                .time(a.getTime())
                .status(a.getStatus())
                .section(a.getQrSession().getSection())
                .period(a.getQrSession().getPeriod())
                .build();
    }
}
