package com.blogxapplication.blogx.service;

import com.blogxapplication.blogx.dto.SignupRequest;
import com.blogxapplication.blogx.entity.User;
import com.blogxapplication.blogx.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String signup(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        if (userRepository.existsByName(signupRequest.getName())) {
            throw new RuntimeException("Name already taken");
        }

        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

        userRepository.save(user);
        return "User registered successfully!";
    }
}
