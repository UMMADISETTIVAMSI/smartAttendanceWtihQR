package com.attendance.controller;

import com.attendance.dto.StudentCreateRequest;
import com.attendance.service.CoordinatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;

@RestController
@RequestMapping("/api/coordinator")
@RequiredArgsConstructor
public class CoordinatorController {

    private final CoordinatorService coordinatorService;

    @GetMapping("/department")
    public ResponseEntity<?> getDepartment(Principal principal) {
        return ResponseEntity.ok(coordinatorService.getCoordinatorDepartment(principal.getName()));
    }

    @PostMapping("/students/bulk")
    public ResponseEntity<?> bulkAddStudents(Principal principal, @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(coordinatorService.bulkAddStudents(principal.getName(), file));
    }

    @PostMapping("/students")
    public ResponseEntity<?> addStudent(Principal principal, @RequestBody StudentCreateRequest request) {
        return ResponseEntity.ok(coordinatorService.addStudent(principal.getName(), request));
    }

    @GetMapping("/students")
    public ResponseEntity<?> getStudents(Principal principal) {
        return ResponseEntity.ok(coordinatorService.getStudents(principal.getName()));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<?> getStudent(Principal principal, @PathVariable String id) {
        return ResponseEntity.ok(coordinatorService.getStudent(principal.getName(), id));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<?> updateStudent(Principal principal, @PathVariable String id,
                                           @RequestBody StudentCreateRequest request) {
        return ResponseEntity.ok(coordinatorService.updateStudent(principal.getName(), id, request));
    }

    @DeleteMapping("/students/{id}")
    public ResponseEntity<?> deleteStudent(Principal principal, @PathVariable String id) {
        coordinatorService.deleteStudent(principal.getName(), id);
        return ResponseEntity.ok("Student deleted");
    }

    @PostMapping("/students/{id}/reset-password")
    public ResponseEntity<?> resetPassword(Principal principal, @PathVariable String id) {
        return ResponseEntity.ok(coordinatorService.resetStudentPassword(principal.getName(), id));
    }

    @PostMapping("/students/{id}/toggle-active")
    public ResponseEntity<?> toggleActive(Principal principal, @PathVariable String id) {
        return ResponseEntity.ok(coordinatorService.toggleStudentActive(principal.getName(), id));
    }
}
