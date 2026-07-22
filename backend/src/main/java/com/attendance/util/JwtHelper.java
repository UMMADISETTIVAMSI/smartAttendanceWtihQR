package com.attendance.util;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class JwtHelper {

    public String generateToken() {
        return UUID.randomUUID().toString().replace("-", "");
    }
}
