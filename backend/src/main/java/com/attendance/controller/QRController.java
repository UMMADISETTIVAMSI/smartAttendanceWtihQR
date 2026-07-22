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
            Principal principal) {
        return ResponseEntity.ok(qrService.generateQR(subjectId, section, period, principal.getName()));
    }

    @GetMapping("/validate/{token}")
    public ResponseEntity<?> validateToken(@PathVariable String token) {
        qrService.validateToken(token);
        return ResponseEntity.ok().build();
    }
}
