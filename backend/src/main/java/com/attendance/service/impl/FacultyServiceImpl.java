package com.attendance.service.impl;

import com.attendance.dto.AttendanceResponse;
import com.attendance.entity.Attendance;
import com.attendance.entity.Faculty;
import com.attendance.entity.Subject;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.AttendanceRepository;
import com.attendance.repository.FacultyRepository;
import com.attendance.repository.SubjectRepository;
import com.attendance.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {

    private final FacultyRepository facultyRepository;
    private final SubjectRepository subjectRepository;
    private final AttendanceRepository attendanceRepository;

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
