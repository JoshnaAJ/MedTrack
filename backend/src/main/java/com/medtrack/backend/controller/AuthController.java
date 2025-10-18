package com.medtrack.backend.controller;

import com.medtrack.backend.dto.AuthRequest;
import com.medtrack.backend.dto.AuthResponse;
import com.medtrack.backend.model.User;
import com.medtrack.backend.repository.UserRepository;
import com.medtrack.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body("email and password required");
        }
        Optional<User> exists = userRepository.findByEmail(req.getEmail());
        if (exists.isPresent()) return ResponseEntity.status(409).body("email exists");
        String hashed = passwordEncoder.encode(req.getPassword());
        User u = new User(req.getName(), req.getEmail(), hashed);
        userRepository.save(u);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            return ResponseEntity.badRequest().body("email and password required");
        }
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        if (userOpt.isEmpty()) return ResponseEntity.status(401).body("invalid credentials");
        User u = userOpt.get();
        if (!passwordEncoder.matches(req.getPassword(), u.getPassword())) {
            return ResponseEntity.status(401).body("invalid credentials");
        }
        String token = jwtUtil.generateToken(u.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, u.getEmail(), u.getName()));
    }
}
