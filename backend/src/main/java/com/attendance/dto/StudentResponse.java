package com.attendance.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class StudentResponse {
    private String id;
    private String userId;
    private String name;
    private String email;
    private String username;
    private String rollNumber;
    private String department;
    private Integer year;
    private Integer semester;
    private String section;
    private boolean active;
}
