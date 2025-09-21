package com.blogxapplication.blogx.repository;

import com.blogxapplication.blogx.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String username); // ✅ add this
    boolean existsByEmail(String email);
    boolean existsByName(String name);  // 👈 Add this line
    Optional<User> findByNameOrEmail(String name, String email);
}
