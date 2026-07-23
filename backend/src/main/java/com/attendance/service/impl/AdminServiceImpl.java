package com.attendance.service.impl;

import com.attendance.dto.AttendanceResponse;
import com.attendance.dto.CoordinatorCreateRequest;
import com.attendance.dto.CoordinatorResponse;
import com.attendance.dto.FacultyCreateRequest;
import com.attendance.dto.FacultyCreateResponse;
import com.attendance.dto.StudentResponse;
import com.attendance.entity.Attendance;
import com.attendance.entity.Coordinator;
import com.attendance.entity.Faculty;
import com.attendance.entity.Student;
import com.attendance.entity.Subject;
import com.attendance.entity.User;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.CoordinatorRepository;
import com.attendance.repository.FacultyRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.repository.SubjectRepository;
import com.attendance.repository.UserRepository;
import com.attendance.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CoordinatorRepository coordinatorRepository;
    private final SubjectRepository subjectRepository;
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public long countStudents() {
        return studentRepository.count();
    }

    @Override
    public long countFaculty() {
        return facultyRepository.count();
    }

    @Override
    public long countSubjects() {
        return subjectRepository.count();
    }

    @Override
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream().map(this::toStudentResponse).toList();
    }

    @Override
    public List<FacultyCreateResponse> getAllFaculty() {
        return facultyRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Override
    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    @Override
    public List<AttendanceResponse> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public Map<String, Object> getOverallStats() {
        long totalAttendance = attendanceRepository.count();
        return Map.of(
                "students", countStudents(),
                "faculty", countFaculty(),
                "subjects", countSubjects(),
                "totalAttendanceRecords", totalAttendance
        );
    }

    private static final String DEFAULT_COORDINATOR_PASSWORD = "Coordinator@123";
    private static final String DEFAULT_PASSWORD = "faculty@123";

    @Override
    public Map<String, Object> createCoordinator(CoordinatorCreateRequest request) {
        if (coordinatorRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (coordinatorRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken");
        }
        Coordinator coordinator = Coordinator.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .username(request.getUsername())
                .mobile(request.getMobile())
                .department(request.getDepartment())
                .password(passwordEncoder.encode(DEFAULT_COORDINATOR_PASSWORD))
                .active(true)
                .build();
        coordinatorRepository.save(coordinator);
        return Map.of(
                "message", "Coordinator created successfully",
                "username", request.getUsername(),
                "password", DEFAULT_COORDINATOR_PASSWORD,
                "coordinator", toCoordinatorResponse(coordinator)
        );
    }

    @Override
    public List<CoordinatorResponse> getAllCoordinators() {
        return coordinatorRepository.findAll().stream().map(this::toCoordinatorResponse).toList();
    }

    @Override
    public void deleteCoordinator(String coordinatorId) {
        coordinatorRepository.findById(coordinatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Coordinator not found"));
        coordinatorRepository.deleteById(coordinatorId);
    }

    @Override
    public Map<String, Object> resetCoordinatorPassword(String coordinatorId) {
        Coordinator coordinator = coordinatorRepository.findById(coordinatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Coordinator not found"));
        coordinator.setPassword(passwordEncoder.encode(DEFAULT_COORDINATOR_PASSWORD));
        coordinatorRepository.save(coordinator);
        return Map.of("message", "Password reset to default", "password", DEFAULT_COORDINATOR_PASSWORD);
    }

    @Override
    public Map<String, Object> toggleCoordinatorActive(String coordinatorId) {
        Coordinator coordinator = coordinatorRepository.findById(coordinatorId)
                .orElseThrow(() -> new ResourceNotFoundException("Coordinator not found"));
        coordinator.setActive(!coordinator.isActive());
        coordinatorRepository.save(coordinator);
        return Map.of("active", coordinator.isActive());
    }

    @Override
    public List<StudentResponse> getStudentsByDepartment(String department) {
        return studentRepository.findByDepartment(department).stream().map(this::toStudentResponse).toList();
    }

    @Override
    public void deleteStudent(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        studentRepository.deleteById(studentId);
        userRepository.deleteById(student.getUser().getId());
    }

    private CoordinatorResponse toCoordinatorResponse(Coordinator c) {
        return CoordinatorResponse.builder()
                .id(c.getId()).name(c.getName()).email(c.getEmail())
                .mobile(c.getMobile()).department(c.getDepartment())
                .username(c.getUsername()).active(c.isActive())
                .build();
    }

    private StudentResponse toStudentResponse(Student s) {
        return StudentResponse.builder()
                .id(s.getId()).userId(s.getUser().getId())
                .name(s.getUser().getName()).email(s.getUser().getEmail())
                .username(s.getUser().getUsername()).rollNumber(s.getRollNumber())
                .department(s.getDepartment()).year(s.getYear())
                .semester(s.getSemester()).section(s.getSection())
                .active(s.isActive())
                .build();
    }

    @Override
    public FacultyCreateResponse createFaculty(FacultyCreateRequest request) {
        if (facultyRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }
        Faculty faculty = Faculty.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(DEFAULT_PASSWORD))
                .department(request.getDepartment())
                .designation(request.getDesignation())
                .role("FACULTY")
                .active(true)
                .build();
        facultyRepository.save(faculty);
        return toResponse(faculty);
    }

    @Override
    public List<FacultyCreateResponse> bulkCreateFaculty(MultipartFile file) {
        List<FacultyCreateResponse> results = new ArrayList<>();
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        try {
            if (filename.endsWith(".csv")) {
                String content = new String(file.getBytes());
                String[] lines = content.split("\n");
                for (int i = 1; i < lines.length; i++) {
                    String line = lines[i].trim();
                    if (line.isEmpty()) continue;
                    String[] cols = line.split(",", -1);
                    if (cols.length < 4) continue;
                    FacultyCreateRequest req = new FacultyCreateRequest();
                    req.setName(cols[0].trim());
                    req.setEmail(cols[1].trim());
                    req.setDepartment(cols[2].trim());
                    req.setDesignation(cols[3].trim());
                    try { results.add(createFaculty(req)); } catch (Exception ignored) {}
                }
            } else {
                try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
                    Sheet sheet = workbook.getSheetAt(0);
                    for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                        Row row = sheet.getRow(i);
                        if (row == null) continue;
                        FacultyCreateRequest req = new FacultyCreateRequest();
                        req.setName(getCellValue(row, 0));
                        req.setEmail(getCellValue(row, 1));
                        req.setDepartment(getCellValue(row, 2));
                        req.setDesignation(getCellValue(row, 3));
                        try { results.add(createFaculty(req)); } catch (Exception ignored) {}
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse file");
        }
        return results;
    }

    @Override
    public void resetFacultyPassword(String facultyId, String newPassword) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        faculty.setPassword(passwordEncoder.encode(newPassword));
        facultyRepository.save(faculty);
    }

    @Override
    public void deleteFaculty(String facultyId) {
        facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        facultyRepository.deleteById(facultyId);
    }

    private String getCellValue(Row row, int col) {
        Cell cell = row.getCell(col);
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            default -> "";
        };
    }

    private FacultyCreateResponse toResponse(Faculty f) {
        return FacultyCreateResponse.builder()
                .id(f.getId())
                .name(f.getName())
                .email(f.getEmail())
                .department(f.getDepartment())
                .designation(f.getDesignation())
                .build();
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
