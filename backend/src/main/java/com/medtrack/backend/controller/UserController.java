package com.medtrack.backend.controller;

import com.medtrack.backend.model.User;
import com.medtrack.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        Object o = request.getAttribute("authEmail");
        if (o == null) return ResponseEntity.status(401).body("unauthenticated");
        String email = o.toString();
        Optional<User> u = userRepository.findByEmail(email);
        if (u.isEmpty()) return ResponseEntity.status(404).body("user not found");
        User user = u.get();
        return ResponseEntity.ok(new java.util.HashMap<>() {{ put("email", user.getEmail()); put("name", user.getName()); }});
    }
}
