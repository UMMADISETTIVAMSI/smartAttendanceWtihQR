package com.attendance.repository;

import com.attendance.entity.Faculty;
import com.attendance.entity.FacultySection;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface FacultySectionRepository extends MongoRepository<FacultySection, String> {
    List<FacultySection> findByFaculty(Faculty faculty);
    boolean existsByFacultyAndDepartmentAndYearAndSectionAndSubjectName(
            Faculty faculty, String department, Integer year, String section, String subjectName);
}
