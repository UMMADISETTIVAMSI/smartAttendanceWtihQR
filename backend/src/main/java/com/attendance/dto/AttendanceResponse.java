package com.attendance.dto;

import com.attendance.entity.Attendance;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class AttendanceResponse {
    private String id;
    private String studentName;
    private String rollNumber;
    private String subjectName;
    private String subjectCode;
    private String facultyName;
    private LocalDate date;
    private LocalTime time;
    private Attendance.Status status;
    private String section;
    private Integer period;
}
