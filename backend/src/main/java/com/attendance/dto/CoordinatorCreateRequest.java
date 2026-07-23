package com.attendance.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CoordinatorCreateRequest {
    @NotBlank private String name;
    @NotBlank @Email private String email;
    @NotBlank private String mobile;
    @NotBlank private String department;
    @NotBlank private String username;
}
