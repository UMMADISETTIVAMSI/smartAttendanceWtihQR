package com.attendance.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "faculty")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Faculty {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String department;

    private String designation;

    @Builder.Default
    private String role = "FACULTY";

    @Builder.Default
    private boolean active = true;
}
