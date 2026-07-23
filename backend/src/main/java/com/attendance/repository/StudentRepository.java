package com.attendance.repository;

import com.attendance.entity.Student;
import com.attendance.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByUser(User user);
    boolean existsByRollNumber(String rollNumber);
    List<Student> findByDepartment(String department);
    List<Student> findByDepartmentIgnoreCaseAndYearAndSectionIgnoreCase(String department, Integer year, String section);
    List<Student> findByDepartmentAndActive(String department, boolean active);
    List<Student> findBySection(String section);
}
