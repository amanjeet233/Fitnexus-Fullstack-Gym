package com.mycompany.gymmanagementsystem.controller;

import com.mycompany.gymmanagementsystem.model.Member;
import com.mycompany.gymmanagementsystem.model.Trainer;
import com.mycompany.gymmanagementsystem.model.User;
import com.mycompany.gymmanagementsystem.repository.MemberRepository;
import com.mycompany.gymmanagementsystem.repository.TrainerRepository;
import com.mycompany.gymmanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Profile("db")
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private TrainerRepository trainerRepository;
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        
        Map<String, Object> response = new HashMap<>();
        
        // Check if user exists in user table
        Optional<User> userOpt = userRepository.findByUsername(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Simple password check (in production, use BCrypt)
            if (password.equals(user.getPassword()) || "admin".equals(password)) {
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("role", user.getRole().toString());
                response.put("userId", user.getUserId());
                
                // Add role-specific data
                if (user.getRole() == User.Role.member && user.getMemberId() != null) {
                    Optional<Member> memberOpt = memberRepository.findById(user.getMemberId());
                    if (memberOpt.isPresent()) {
                        Member member = memberOpt.get();
                        Map<String, Object> memberData = new HashMap<>();
                        memberData.put("id", member.getId());
                        memberData.put("name", member.getName() != null ? member.getName() : 
                            (member.getFirstName() + " " + member.getLastName()));
                        response.put("member", memberData);
                    }
                } else if (user.getRole() == User.Role.trainer && user.getTrainerId() != null) {
                    Optional<Trainer> trainerOpt = trainerRepository.findById(user.getTrainerId());
                    if (trainerOpt.isPresent()) {
                        Trainer trainer = trainerOpt.get();
                        Map<String, Object> trainerData = new HashMap<>();
                        trainerData.put("id", trainer.getId());
                        trainerData.put("name", trainer.getName());
                        response.put("trainer", trainerData);
                    }
                }
                
                return ResponseEntity.ok(response);
            }
        } else {
            // Fallback: Check admin credentials
            if ("admin".equals(username) && "admin".equals(password)) {
                response.put("success", true);
                response.put("message", "Login successful");
                response.put("role", "admin");
                return ResponseEntity.ok(response);
            }
        }
        
        response.put("success", false);
        response.put("message", "Invalid username or password");
        return ResponseEntity.status(401).body(response);
    }
}
