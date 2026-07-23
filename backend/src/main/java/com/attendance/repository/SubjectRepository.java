package com.attendance.repository;

import com.attendance.entity.Faculty;
import com.attendance.entity.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    Optional<Subject> findBySubjectCode(String subjectCode);
    List<Subject> findByFaculty(Faculty faculty);
    List<Subject> findByDepartmentAndSemester(String department, Integer semester);
    List<Subject> findByDepartment(String department);
    boolean existsBySubjectCode(String subjectCode);
}
