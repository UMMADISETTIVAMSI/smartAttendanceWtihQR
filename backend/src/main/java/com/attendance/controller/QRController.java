package com.attendance.controller;

import com.attendance.service.QRService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/qr")
@RequiredArgsConstructor
public class QRController {

    private final QRService qrService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateQR(
            @RequestParam String subjectId,
            @RequestParam String section,
            @RequestParam Integer period,
            @RequestParam(defaultValue = "5") Integer durationMinutes,
            Principal principal) {
        return ResponseEntity.ok(qrService.generateQR(subjectId, section, period, durationMinutes, principal.getName()));
    }

    @GetMapping("/validate/{token}")
    public ResponseEntity<?> validateToken(@PathVariable String token) {
        qrService.validateToken(token);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/session/{sessionId}/scanned")
    public ResponseEntity<?> getScanned(@PathVariable String sessionId) {
        return ResponseEntity.ok(qrService.getScannedStudents(sessionId));
    }

    @PostMapping("/session/{sessionId}/confirm")
    public ResponseEntity<?> confirmAttendance(@PathVariable String sessionId) {
        return ResponseEntity.ok(qrService.confirmAttendance(sessionId));
    }

    @PostMapping("/session/{sessionId}/cancel")
    public ResponseEntity<?> cancelAttendance(@PathVariable String sessionId) {
        return ResponseEntity.ok(qrService.cancelAttendance(sessionId));
    }
}
