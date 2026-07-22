package com.attendance.controller;

import com.attendance.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        return ResponseEntity.ok(facultyService.getProfile(principal.getName()));
    }

    @GetMapping("/subjects")
    public ResponseEntity<?> getSubjects(Principal principal) {
        return ResponseEntity.ok(facultyService.getAssignedSubjects(principal.getName()));
    }

    @GetMapping("/attendance/today")
    public ResponseEntity<?> getTodayAttendance(
            Principal principal,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(facultyService.getTodayAttendance(principal.getName(), targetDate));
    }

    @GetMapping("/attendance/export")
    public ResponseEntity<byte[]> exportExcel(
            @RequestParam String subjectId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        byte[] data = facultyService.exportAttendanceToExcel(subjectId, from, to);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=attendance.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }
}
