package com.attendance.controller;

import com.attendance.dto.AttendanceRequest;
import com.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/mark")
    public ResponseEntity<?> markAttendance(
            @Valid @RequestBody AttendanceRequest request,
            Principal principal) {
        return ResponseEntity.ok(attendanceService.markAttendance(request, principal.getName()));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<?> getBySubject(
            @PathVariable String subjectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(attendanceService.getBySubjectAndDate(subjectId, targetDate));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<?> getByStudent(@PathVariable String studentId) {
        return ResponseEntity.ok(attendanceService.getByStudent(studentId));
    }
}
