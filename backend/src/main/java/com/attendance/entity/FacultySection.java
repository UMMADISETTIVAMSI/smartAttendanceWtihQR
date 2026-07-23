package com.attendance.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "faculty_sections")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FacultySection {

    @Id
    private String id;

    @DBRef
    private Faculty faculty;

    private String department;
    private Integer year;
    private String section;
    private String subjectName;
    private String subjectId;
    private String subjectCode;
}
