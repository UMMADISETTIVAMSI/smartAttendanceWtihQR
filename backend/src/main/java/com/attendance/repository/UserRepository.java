package com.attendance.repository;

import com.attendance.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByName(String name);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
