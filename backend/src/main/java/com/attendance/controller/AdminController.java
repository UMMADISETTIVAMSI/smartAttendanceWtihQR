package com.attendance.controller;

import com.attendance.dto.CoordinatorCreateRequest;
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

    // ── Faculty ──────────────────────────────────────────
    @PostMapping("/faculty")
    public ResponseEntity<?> createFaculty(@RequestBody FacultyCreateRequest request) {
        return ResponseEntity.ok(adminService.createFaculty(request));
    }

    @PostMapping("/faculty/bulk")
    public ResponseEntity<?> bulkCreateFaculty(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(adminService.bulkCreateFaculty(file));
    }

    @PostMapping("/faculty/{id}/reset-password")
    public ResponseEntity<?> resetFacultyPassword(@PathVariable String id, @RequestBody Map<String, String> body) {
        adminService.resetFacultyPassword(id, body.get("password"));
        return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
    }

    @DeleteMapping("/faculty/{id}")
    public ResponseEntity<?> deleteFaculty(@PathVariable String id) {
        adminService.deleteFaculty(id);
        return ResponseEntity.ok("Faculty deleted successfully");
    }

    @GetMapping("/faculty")
    public ResponseEntity<?> getAllFaculty() {
        return ResponseEntity.ok(adminService.getAllFaculty());
    }

    // ── Coordinators ─────────────────────────────────────
    @PostMapping("/coordinators")
    public ResponseEntity<?> createCoordinator(@RequestBody CoordinatorCreateRequest request) {
        return ResponseEntity.ok(adminService.createCoordinator(request));
    }

    @GetMapping("/coordinators")
    public ResponseEntity<?> getAllCoordinators() {
        return ResponseEntity.ok(adminService.getAllCoordinators());
    }

    @DeleteMapping("/coordinators/{id}")
    public ResponseEntity<?> deleteCoordinator(@PathVariable String id) {
        adminService.deleteCoordinator(id);
        return ResponseEntity.ok(Map.of("message", "Coordinator deleted"));
    }

    @PostMapping("/coordinators/{id}/reset-password")
    public ResponseEntity<?> resetCoordinatorPassword(@PathVariable String id) {
        return ResponseEntity.ok(adminService.resetCoordinatorPassword(id));
    }

    @PostMapping("/coordinators/{id}/toggle-active")
    public ResponseEntity<?> toggleCoordinatorActive(@PathVariable String id) {
        return ResponseEntity.ok(adminService.toggleCoordinatorActive(id));
    }

    // ── Students ──────────────────────────────────────────
    @GetMapping("/students")
    public ResponseEntity<?> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @GetMapping("/students/department/{dept}")
    public ResponseEntity<?> getStudentsByDept(@PathVariable String dept) {
        return ResponseEntity.ok(adminService.getStudentsByDepartment(dept));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable String id) {
        adminService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted"));
    }

    // ── Stats ─────────────────────────────────────────────
    @GetMapping("/stats/students")
    public ResponseEntity<Long> countStudents() { return ResponseEntity.ok(adminService.countStudents()); }

    @GetMapping("/stats/faculty")
    public ResponseEntity<Long> countFaculty() { return ResponseEntity.ok(adminService.countFaculty()); }

    @GetMapping("/stats/subjects")
    public ResponseEntity<Long> countSubjects() { return ResponseEntity.ok(adminService.countSubjects()); }

    @GetMapping("/stats")
    public ResponseEntity<?> getOverallStats() { return ResponseEntity.ok(adminService.getOverallStats()); }

    @GetMapping("/subjects")
    public ResponseEntity<?> getAllSubjects() { return ResponseEntity.ok(adminService.getAllSubjects()); }

    @GetMapping("/attendance")
    public ResponseEntity<?> getAttendanceByDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(adminService.getAttendanceByDate(date != null ? date : LocalDate.now()));
    }
}
