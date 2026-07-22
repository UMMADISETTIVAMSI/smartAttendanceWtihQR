package com.attendance.config;

import com.attendance.entity.Faculty;
import com.attendance.entity.Student;
import com.attendance.entity.User;
import com.attendance.repository.FacultyRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final FacultyRepository facultyRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        // ── ADMIN (stored in users collection) ─────────────
        if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
            User admin = User.builder()
                    .name("Admin")
                    .username("Admin")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            System.out.println("✅ Admin   → admin@gmail.com / admin123");
        } else {
            userRepository.findByEmail("admin@gmail.com").ifPresent(u -> {
                if (!"Admin".equals(u.getUsername())) { u.setUsername("Admin"); userRepository.save(u); }
            });
        }

        // ── FACULTY (stored directly in faculty collection) ─
        if (facultyRepository.findByEmail("faculty@attendance.com").isEmpty()) {
            Faculty faculty = Faculty.builder()
                    .name("Dr. John Smith")
                    .username("drjohnsmith")
                    .email("faculty@attendance.com")
                    .password(passwordEncoder.encode("faculty@123"))
                    .department("Computer Science")
                    .designation("Associate Professor")
                    .role("FACULTY")
                    .active(true)
                    .build();
            facultyRepository.save(faculty);
            System.out.println("✅ Faculty  → faculty@attendance.com / faculty@123");
        } else {
            facultyRepository.findByEmail("faculty@attendance.com").ifPresent(f -> {
                if (!"drjohnsmith".equals(f.getUsername())) { f.setUsername("drjohnsmith"); facultyRepository.save(f); }
            });
        }

        // ── STUDENT (stored in users + students collection) ─
        if (userRepository.findByEmail("student@attendance.com").isEmpty()) {
            User studentUser = User.builder()
                    .name("Alice Johnson")
                    .username("alicejohnson")
                    .email("student@attendance.com")
                    .password(passwordEncoder.encode("student123"))
                    .role(User.Role.STUDENT)
                    .active(true)
                    .build();
            userRepository.save(studentUser);

            Student student = Student.builder()
                    .user(studentUser)
                    .rollNumber("CS2024001")
                    .department("Computer Science")
                    .semester(3)
                    .section("A")
                    .build();
            studentRepository.save(student);
            System.out.println("✅ Student  → student@attendance.com / student123");
        } else {
            userRepository.findByEmail("student@attendance.com").ifPresent(u -> {
                if (!"alicejohnson".equals(u.getUsername())) { u.setUsername("alicejohnson"); userRepository.save(u); }
            });
        }
    }
}
