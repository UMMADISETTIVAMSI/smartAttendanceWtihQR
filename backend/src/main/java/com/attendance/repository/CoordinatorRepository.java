package com.attendance.repository;

import com.attendance.entity.Coordinator;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CoordinatorRepository extends MongoRepository<Coordinator, String> {
    Optional<Coordinator> findByEmail(String email);
    Optional<Coordinator> findFirstByEmail(String email);
    Optional<Coordinator> findFirstByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
