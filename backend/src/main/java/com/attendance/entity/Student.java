package com.attendance.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "students")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Student {

    @Id
    private String id;

    @DBRef
    private User user;

    @Indexed(unique = true)
    private String rollNumber;

    private String department;

    private Integer semester;

    private String section;
}
