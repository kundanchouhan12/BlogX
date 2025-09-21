package com.blogxapplication.blogx.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String usernameOrEmail; // 👈 must match Postman JSON
    private String password;
}
