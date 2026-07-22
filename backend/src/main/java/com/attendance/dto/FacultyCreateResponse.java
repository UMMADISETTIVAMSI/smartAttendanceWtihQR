package com.attendance.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FacultyCreateResponse {
    private String id;
    private String name;
    private String email;
    private String department;
    private String designation;
}
