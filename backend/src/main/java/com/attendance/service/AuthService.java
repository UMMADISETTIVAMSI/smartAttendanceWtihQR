package com.attendance.service;

import com.attendance.dto.ChangePasswordRequest;
import com.attendance.dto.LoginRequest;
import com.attendance.dto.RegisterRequest;

import java.util.Map;

public interface AuthService {
    Map<String, Object> login(LoginRequest request);
    Map<String, Object> register(RegisterRequest request);
    Map<String, Object> changePassword(ChangePasswordRequest request);
}
