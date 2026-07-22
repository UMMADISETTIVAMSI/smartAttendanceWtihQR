package com.attendance.service.impl;

import com.attendance.config.JwtUtil;
import com.attendance.dto.ChangePasswordRequest;
import com.attendance.dto.LoginRequest;
import com.attendance.dto.RegisterRequest;
import com.attendance.entity.Faculty;
import com.attendance.entity.Student;
import com.attendance.entity.User;
import com.attendance.exception.ResourceNotFoundException;
import com.attendance.repository.FacultyRepository;
import com.attendance.repository.StudentRepository;
import com.attendance.repository.UserRepository;
import com.attendance.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public Map<String, Object> login(LoginRequest request) {
        String identifier = request.getIdentifier().trim();
        String identifierLower = identifier.toLowerCase();

        // email lookup is case-insensitive (stored lowercase), username is exact case
        Optional<Faculty> facultyOpt = facultyRepository.findByEmail(identifierLower)
                .or(() -> facultyRepository.findByUsername(identifier))
                .or(() -> facultyRepository.findByName(identifier));

        if (facultyOpt.isPresent()) {
            Faculty faculty = facultyOpt.get();
            if (!passwordEncoder.matches(request.getPassword(), faculty.getPassword())) {
                throw new IllegalArgumentException("Invalid password");
            }
            String token = jwtUtil.generateToken(faculty.getEmail(), "FACULTY");
            return Map.of(
                    "token", token,
                    "role", "FACULTY",
                    "name", faculty.getName(),
                    "email", faculty.getEmail(),
                    "id", faculty.getId()
            );
        }

        // email lookup is case-insensitive (stored lowercase), username is exact case
        User user = userRepository.findByEmail(identifierLower)
                .or(() -> userRepository.findByUsername(identifier))
                .or(() -> userRepository.findByName(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + identifier));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return Map.of(
                "token", token,
                "role", user.getRole(),
                "name", user.getName(),
                "email", user.getEmail(),
                "id", user.getId()
        );
    }

    @Override
    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .active(true)
                .build();
        userRepository.save(user);

        if (request.getRole() == User.Role.STUDENT) {
            Student student = Student.builder()
                    .user(user)
                    .rollNumber(request.getRollNumber())
                    .department(request.getDepartment())
                    .semester(request.getSemester())
                    .section(request.getSection())
                    .build();
            studentRepository.save(student);
        }

        return Map.of("message", "User registered successfully", "email", user.getEmail());
    }

    @Override
    public Map<String, Object> changePassword(ChangePasswordRequest request) {
        String identifier = request.getEmail().trim();

        Optional<Faculty> facultyOpt = facultyRepository.findByEmail(identifier.toLowerCase())
                .or(() -> facultyRepository.findByName(identifier));

        if (facultyOpt.isPresent()) {
            Faculty faculty = facultyOpt.get();
            if (!passwordEncoder.matches(request.getOldPassword(), faculty.getPassword())) {
                throw new IllegalArgumentException("Old password is incorrect");
            }
            faculty.setPassword(passwordEncoder.encode(request.getNewPassword()));
            facultyRepository.save(faculty);
            return Map.of("message", "Password changed successfully");
        }

        User user = userRepository.findByEmail(identifier.toLowerCase())
                .or(() -> userRepository.findByName(identifier))
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return Map.of("message", "Password changed successfully");
    }
}
