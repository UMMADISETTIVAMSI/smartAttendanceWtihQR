package com.attendance.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AttendanceRequest {

    @NotBlank(message = "QR token is required")
    private String token;

    private String deviceId;

    private String location;
}
