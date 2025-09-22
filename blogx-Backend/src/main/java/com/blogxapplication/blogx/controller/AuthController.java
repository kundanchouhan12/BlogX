package com.blogxapplication.blogx.controller;

import com.blogxapplication.blogx.dto.LoginRequest;
import com.blogxapplication.blogx.dto.LoginResponse;
import com.blogxapplication.blogx.dto.SignupRequest;
import com.blogxapplication.blogx.entity.User;
import com.blogxapplication.blogx.repository.UserRepository;
import com.blogxapplication.blogx.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "https://blogx-backendwebservice-latest.onrender.com")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // LOGIN
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(), // name or email
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(userDetails.getUsername());

        return new LoginResponse(token, userDetails.getUsername());
    }

    // SIGNUP
    @PostMapping("/signup")
    public Map<String, String> signup(@RequestBody SignupRequest request) {
        if (userRepository.existsByName(request.getName())) {
            throw new RuntimeException("Name already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully. Please login to get JWT token.");
        return response;
    }

    // UPDATE user
    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody SignupRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());

        if (!user.getEmail().equals(request.getEmail()) &&
                userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepository.save(user);
    }

    // DELETE all users
    @DeleteMapping("/all")
    public Map<String, String> deleteAllUsers() {
        userRepository.deleteAll();
        Map<String, String> response = new HashMap<>();
        response.put("message", "All users deleted successfully");
        return response;
    }
}
