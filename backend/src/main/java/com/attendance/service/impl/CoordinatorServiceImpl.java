package com.attendance.service.impl;

import com.attendance.dto.StudentCreateRequest;
import com.attendance.dto.StudentResponse;
import com.attendance.entity.Coordinator;
import com.attendance.entity.Student;
import com.attendance.entity.User;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.CoordinatorRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.repository.UserRepository;
import com.attendance.service.CoordinatorService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CoordinatorServiceImpl implements CoordinatorService {

    private static final String DEFAULT_STUDENT_PASSWORD = "Student@123";

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CoordinatorRepository coordinatorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public String getCoordinatorDepartment(String coordinatorEmail) {
        Coordinator coordinator = coordinatorRepository.findFirstByEmail(coordinatorEmail.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Coordinator not found"));
        return coordinator.getDepartment();
    }

    @Override
    public Map<String, Object> addStudent(String coordinatorEmail, StudentCreateRequest request) {
        String department = getCoordinatorDepartment(coordinatorEmail);

        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (studentRepository.existsByRollNumber(request.getRollNumber())) {
            throw new IllegalArgumentException("Roll number already exists");
        }
        if (userRepository.existsByUsername(request.getRollNumber())) {
            throw new IllegalArgumentException("Username (roll number) already taken");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .username(request.getRollNumber())   // username = roll number
                .password(passwordEncoder.encode(DEFAULT_STUDENT_PASSWORD))
                .role(User.Role.STUDENT)
                .department(department)
                .active(true)
                .build();
        userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .name(request.getName())
                .rollNumber(request.getRollNumber())
                .department(department)
                .year(request.getYear())
                .section(request.getSection())
                .active(true)
                .build();
        studentRepository.save(student);

        return Map.of(
                "message", "Student created successfully",
                "username", request.getRollNumber(),
                "password", DEFAULT_STUDENT_PASSWORD,
                "student", toResponse(student)
        );
    }

    @Override
    public List<StudentResponse> getStudents(String coordinatorEmail) {
        String department = getCoordinatorDepartment(coordinatorEmail);
        return studentRepository.findByDepartment(department).stream().map(this::toResponse).toList();
    }

    @Override
    public StudentResponse getStudent(String coordinatorEmail, String studentId) {
        String department = getCoordinatorDepartment(coordinatorEmail);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (!department.equals(student.getDepartment())) {
            throw new IllegalArgumentException("Access denied: student not in your department");
        }
        return toResponse(student);
    }

    @Override
    public StudentResponse updateStudent(String coordinatorEmail, String studentId, StudentCreateRequest request) {
        String department = getCoordinatorDepartment(coordinatorEmail);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (!department.equals(student.getDepartment())) {
            throw new IllegalArgumentException("Access denied: student not in your department");
        }

        User user = student.getUser();
        user.setName(request.getName());
        if (!user.getEmail().equals(request.getEmail().toLowerCase())) {
            if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(request.getEmail().toLowerCase());
        }
        userRepository.save(user);

        student.setName(request.getName());
        student.setYear(request.getYear());
        student.setSection(request.getSection());
        studentRepository.save(student);

        return toResponse(student);
    }

    @Override
    public void deleteStudent(String coordinatorEmail, String studentId) {
        String department = getCoordinatorDepartment(coordinatorEmail);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (!department.equals(student.getDepartment())) {
            throw new IllegalArgumentException("Access denied: student not in your department");
        }
        studentRepository.deleteById(studentId);
        userRepository.deleteById(student.getUser().getId());
    }

    @Override
    public Map<String, Object> resetStudentPassword(String coordinatorEmail, String studentId) {
        String department = getCoordinatorDepartment(coordinatorEmail);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (!department.equals(student.getDepartment())) {
            throw new IllegalArgumentException("Access denied: student not in your department");
        }
        User user = student.getUser();
        user.setPassword(passwordEncoder.encode(DEFAULT_STUDENT_PASSWORD));
        userRepository.save(user);
        return Map.of("message", "Password reset to default", "password", DEFAULT_STUDENT_PASSWORD);
    }

    @Override
    public Map<String, Object> toggleStudentActive(String coordinatorEmail, String studentId) {
        String department = getCoordinatorDepartment(coordinatorEmail);
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        if (!department.equals(student.getDepartment())) {
            throw new IllegalArgumentException("Access denied: student not in your department");
        }
        student.setActive(!student.isActive());
        User user = student.getUser();
        user.setActive(student.isActive());
        userRepository.save(user);
        studentRepository.save(student);
        return Map.of("active", student.isActive(), "message", student.isActive() ? "Student activated" : "Student deactivated");
    }

    @Override
    public List<StudentResponse> bulkAddStudents(String coordinatorEmail, MultipartFile file) {
        List<StudentResponse> results = new ArrayList<>();
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
                    StudentCreateRequest req = new StudentCreateRequest();
                    req.setName(cols[0].trim());
                    req.setEmail(cols[1].trim());
                    req.setRollNumber(cols[2].trim());
                    req.setYear(cols[3].trim().isEmpty() ? null : Integer.parseInt(cols[3].trim()));
                    req.setSection(cols.length > 4 ? cols[4].trim() : "");
                    try {
                        Map<String, Object> r = addStudent(coordinatorEmail, req);
                        results.add((StudentResponse) r.get("student"));
                    } catch (Exception ignored) {}
                }
            } else {
                try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
                    Sheet sheet = workbook.getSheetAt(0);
                    for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                        Row row = sheet.getRow(i);
                        if (row == null) continue;
                        StudentCreateRequest req = new StudentCreateRequest();
                        req.setName(getCellValue(row, 0));
                        req.setEmail(getCellValue(row, 1));
                        req.setRollNumber(getCellValue(row, 2));
                        String yr = getCellValue(row, 3);
                        req.setYear(yr.isEmpty() ? null : Integer.parseInt(yr));
                        req.setSection(getCellValue(row, 4));
                        try {
                            Map<String, Object> r = addStudent(coordinatorEmail, req);
                            results.add((StudentResponse) r.get("student"));
                        } catch (Exception ignored) {}
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to parse file");
        }
        return results;
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

    private StudentResponse toResponse(Student s) {
        return StudentResponse.builder()
                .id(s.getId())
                .userId(s.getUser().getId())
                .name(s.getUser().getName())
                .email(s.getUser().getEmail())
                .username(s.getUser().getUsername())
                .rollNumber(s.getRollNumber())
                .department(s.getDepartment())
                .year(s.getYear())
                .semester(s.getSemester())
                .section(s.getSection())
                .active(s.isActive())
                .build();
    }
}
