package com.attendance.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subjects")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subject {

    @Id
    private String id;

    @Indexed(unique = true)
    private String subjectCode;

    private String subjectName;

    private String department;

    private Integer semester;

    @DBRef
    private Faculty faculty;
}
