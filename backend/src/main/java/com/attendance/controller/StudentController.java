package com.attendance.controller;

import com.attendance.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Principal principal) {
        return ResponseEntity.ok(studentService.getProfile(principal.getName()));
    }

    @GetMapping("/attendance/history")
    public ResponseEntity<?> getHistory(Principal principal) {
        return ResponseEntity.ok(studentService.getAttendanceHistory(principal.getName()));
    }

    @GetMapping("/attendance/subject-wise")
    public ResponseEntity<?> getSubjectWise(Principal principal) {
        return ResponseEntity.ok(studentService.getSubjectWiseAttendance(principal.getName()));
    }

    @GetMapping("/attendance/summary")
    public ResponseEntity<?> getSummary(Principal principal) {
        return ResponseEntity.ok(studentService.getAttendanceSummary(principal.getName()));
    }
}
