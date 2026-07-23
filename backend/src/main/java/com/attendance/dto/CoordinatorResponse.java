package com.attendance.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class CoordinatorResponse {
    private String id;
    private String name;
    private String email;
    private String mobile;
    private String department;
    private String username;
    private boolean active;
}
