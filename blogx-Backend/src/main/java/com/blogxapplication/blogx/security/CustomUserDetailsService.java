package com.blogxapplication.blogx.security;

import com.blogxapplication.blogx.entity.User;
import com.blogxapplication.blogx.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String nameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByNameOrEmail(nameOrEmail, nameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + nameOrEmail));

        return new org.springframework.security.core.userdetails.User(
                user.getName(),  // JWT me username jayega
                user.getPassword(),
                java.util.Collections.emptyList()
        );
    }
}
