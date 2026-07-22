package com.attendance.repository;

import com.attendance.entity.Faculty;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface FacultyRepository extends MongoRepository<Faculty, String> {
    Optional<Faculty> findByEmail(String email);
    Optional<Faculty> findByUsername(String username);
    Optional<Faculty> findByName(String name);
    boolean existsByEmail(String email);
}
