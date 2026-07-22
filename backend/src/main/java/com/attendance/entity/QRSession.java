package com.attendance.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "qr_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class QRSession {

    @Id
    private String id;

    @Indexed(unique = true)
    private String sessionId;

    @Indexed(unique = true)
    private String token;

    @DBRef
    private Subject subject;

    @DBRef
    private Faculty faculty;

    private String section;

    private Integer period;

    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    @Builder.Default
    private boolean active = true;
}
