package com.attendance.service.impl;

import com.attendance.dto.AttendanceResponse;
import com.attendance.entity.*;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.*;
import com.attendance.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {

    private final FacultyRepository facultyRepository;
    private final SubjectRepository subjectRepository;
    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;
    private final FacultySectionRepository facultySectionRepository;

    @Override
    public Faculty getProfile(String email) {
        return facultyRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found"));
    }

    @Override
    public List<Subject> getAssignedSubjects(String email) {
        Faculty faculty = getProfile(email);
        return subjectRepository.findByFaculty(faculty);
    }

    @Override
    public List<AttendanceResponse> getTodayAttendance(String email, LocalDate date) {
        Faculty faculty = getProfile(email);
        return attendanceRepository.findByFacultyAndDate(faculty, date)
                .stream().map(this::mapToResponse).toList();
    }

    @Override
    public byte[] exportAttendanceToExcel(String subjectId, LocalDate from, LocalDate to) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found"));

        List<Attendance> records = attendanceRepository.findByStudentAndDateBetween(null, from, to)
                .stream().filter(a -> a.getSubject().getId().equals(subjectId)).toList();

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Attendance");
            Row header = sheet.createRow(0);
            String[] columns = {"Roll No", "Student Name", "Subject", "Date", "Time", "Status"};
            for (int i = 0; i < columns.length; i++) header.createCell(i).setCellValue(columns[i]);

            int rowNum = 1;
            for (Attendance a : records) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(a.getStudent().getRollNumber());
                row.createCell(1).setCellValue(a.getStudent().getUser().getName());
                row.createCell(2).setCellValue(a.getSubject().getSubjectName());
                row.createCell(3).setCellValue(a.getDate().toString());
                row.createCell(4).setCellValue(a.getTime().toString());
                row.createCell(5).setCellValue(a.getStatus().name());
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Excel file");
        }
    }

    @Override
    public List<String> getCoordinatorDepartments() {
        return studentRepository.findAll().stream()
                .map(Student::getDepartment)
                .filter(d -> d != null && !d.isBlank())
                .distinct()
                .sorted()
                .toList();
    }

    @Override
    public List<Student> getStudentsByFilter(String department, Integer year, String section) {
        return studentRepository.findByDepartmentIgnoreCaseAndYearAndSectionIgnoreCase(department, year, section);
    }

    @Override
    public List<Map<String, Object>> getFacultyByDepartment(String department) {
        return subjectRepository.findByDepartment(department).stream()
                .filter(s -> s.getFaculty() != null)
                .map(s -> Map.<String, Object>of(
                        "facultyId", s.getFaculty().getId(),
                        "facultyName", s.getFaculty().getName(),
                        "designation", s.getFaculty().getDesignation() != null ? s.getFaculty().getDesignation() : "",
                        "subjectName", s.getSubjectName(),
                        "subjectCode", s.getSubjectCode()
                ))
                .toList();
    }

    @Override
    public List<FacultySection> getMySections(String email) {
        Faculty faculty = getProfile(email);
        return facultySectionRepository.findByFaculty(faculty);
    }

    @Override
    public FacultySection addSection(String email, Map<String, Object> body) {
        Faculty faculty = getProfile(email);
        String department = (String) body.get("department");
        Integer year = body.get("year") instanceof Integer ? (Integer) body.get("year") : Integer.parseInt(body.get("year").toString());
        String section = (String) body.get("section");
        String subjectName = body.get("subjectName") != null ? (String) body.get("subjectName") : null;
        String subjectId = body.get("subjectId") != null ? (String) body.get("subjectId") : null;
        String subjectCode = body.get("subjectCode") != null ? (String) body.get("subjectCode") : null;

        boolean exists = facultySectionRepository
                .existsByFacultyAndDepartmentAndYearAndSectionAndSubjectName(faculty, department, year, section, subjectName);
        if (exists) throw new IllegalArgumentException("Section already added");

        FacultySection fs = FacultySection.builder()
                .faculty(faculty)
                .department(department)
                .year(year)
                .section(section)
                .subjectName(subjectName)
                .subjectId(subjectId)
                .subjectCode(subjectCode)
                .build();
        return facultySectionRepository.save(fs);
    }

    @Override
    public void removeSection(String email, String sectionId) {
        Faculty faculty = getProfile(email);
        FacultySection fs = facultySectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found"));
        if (!fs.getFaculty().getId().equals(faculty.getId()))
            throw new IllegalArgumentException("Access denied");
        facultySectionRepository.deleteById(sectionId);
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
