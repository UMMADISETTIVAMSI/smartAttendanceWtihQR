package com.attendance.dto;

import com.attendance.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role is required")
    private User.Role role;

    // Student-specific fields
    private String rollNumber;
    private String department;
    private Integer semester;
    private String section;

    // Faculty-specific fields
    private String employeeId;
    private String designation;
}
