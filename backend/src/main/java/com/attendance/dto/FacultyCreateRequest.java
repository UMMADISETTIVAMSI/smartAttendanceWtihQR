package com.attendance.dto;

import lombok.Data;

@Data
public class FacultyCreateRequest {
    private String name;
    private String email;
    private String department;
    private String designation;
}
