package com.attendance.service.impl;

import com.attendance.dto.AttendanceResponse;
import com.attendance.entity.Attendance;
import com.attendance.entity.Student;
import com.attendance.entity.Subject;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.repository.SubjectRepository;
import com.attendance.repository.UserRepository;
import com.attendance.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final AttendanceRepository attendanceRepository;
    private final SubjectRepository subjectRepository;

    @Override
    public Student getProfile(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return studentRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
    }

    @Override
    public List<AttendanceResponse> getAttendanceHistory(String email) {
        Student student = getProfile(email);
        return attendanceRepository.findByStudent(student)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<Map<String, Object>> getSubjectWiseAttendance(String email) {
        Student student = getProfile(email);
        List<Subject> subjects = subjectRepository.findByDepartmentAndSemester(
                student.getDepartment(), student.getSemester());

        List<Map<String, Object>> result = new ArrayList<>();
        for (Subject subject : subjects) {
            long total = attendanceRepository.countByStudentAndSubject(student, subject);
            long present = attendanceRepository.countByStudentAndSubjectAndStatus(student, subject, Attendance.Status.PRESENT);
            double percentage = total > 0 ? (present * 100.0 / total) : 0.0;

            result.add(Map.of(
                    "subjectCode", subject.getSubjectCode(),
                    "subjectName", subject.getSubjectName(),
                    "total", total,
                    "present", present,
                    "absent", total - present,
                    "percentage", Math.round(percentage * 100.0) / 100.0
            ));
        }
        return result;
    }

    @Override
    public Map<String, Object> getAttendanceSummary(String email) {
        Student student = getProfile(email);
        List<Attendance> all = attendanceRepository.findByStudent(student);
        long total = all.size();
        long present = all.stream().filter(a -> a.getStatus() == Attendance.Status.PRESENT).count();
        double percentage = total > 0 ? (present * 100.0 / total) : 0.0;

        return Map.of(
                "total", total,
                "present", present,
                "absent", total - present,
                "percentage", Math.round(percentage * 100.0) / 100.0
        );
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
