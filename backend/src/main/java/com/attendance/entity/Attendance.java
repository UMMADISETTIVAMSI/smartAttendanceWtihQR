package com.attendance.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Document(collection = "attendance")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Attendance {

    @Id
    private String id;

    @DBRef
    private Student student;

    @DBRef
    private Subject subject;

    @DBRef
    private Faculty faculty;

    @DBRef
    private QRSession qrSession;

    private LocalDate date;

    private LocalTime time;

    private Status status;

    private String deviceId;

    private String location;

    public enum Status {
        PRESENT, ABSENT
    }
}
