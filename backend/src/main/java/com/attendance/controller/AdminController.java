package com.attendance.controller;

import com.attendance.dto.FacultyCreateRequest;
import com.attendance.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/faculty")
    public ResponseEntity<?> createFaculty(@RequestBody FacultyCreateRequest request) {
        return ResponseEntity.ok(adminService.createFaculty(request));
    }

    @PostMapping("/faculty/bulk")
    public ResponseEntity<?> bulkCreateFaculty(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(adminService.bulkCreateFaculty(file));
    }

    @PostMapping("/faculty/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable String id, @RequestBody Map<String, String> body) {
        adminService.resetFacultyPassword(id, body.get("password"));
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @DeleteMapping("/faculty/{id}")
    public ResponseEntity<?> deleteFaculty(@PathVariable String id) {
        adminService.deleteFaculty(id);
        return ResponseEntity.ok("Faculty deleted successfully");
    }

    @GetMapping("/stats/students")
    public ResponseEntity<Long> countStudents() {
        return ResponseEntity.ok(adminService.countStudents());
    }

    @GetMapping("/stats/faculty")
    public ResponseEntity<Long> countFaculty() {
        return ResponseEntity.ok(adminService.countFaculty());
    }

    @GetMapping("/stats/subjects")
    public ResponseEntity<Long> countSubjects() {
        return ResponseEntity.ok(adminService.countSubjects());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getOverallStats() {
        return ResponseEntity.ok(adminService.getOverallStats());
    }

    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @GetMapping("/faculty")
    public ResponseEntity<?> getAllFaculty() {
        return ResponseEntity.ok(adminService.getAllFaculty());
    }

    @GetMapping("/subjects")
    public ResponseEntity<?> getAllSubjects() {
        return ResponseEntity.ok(adminService.getAllSubjects());
    }

    @GetMapping("/attendance")
    public ResponseEntity<?> getAttendanceByDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = date != null ? date : LocalDate.now();
        return ResponseEntity.ok(adminService.getAttendanceByDate(targetDate));
    }
}
