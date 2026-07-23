package com.attendance.dto;

import lombok.Data;

@Data
public class StudentCreateRequest {
    private String name;
    private String email;
    private String rollNumber;
    private Integer year;
    private String section;
    // department is NOT provided by coordinator — set from their profile
}
