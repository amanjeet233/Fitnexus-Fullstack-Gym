package com.mycompany.gymmanagementsystem.controller;

import com.mycompany.gymmanagementsystem.model.Trainer;
import com.mycompany.gymmanagementsystem.model.User;
import com.mycompany.gymmanagementsystem.repository.TrainerRepository;
import com.mycompany.gymmanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.*;

@Profile("db")
@RestController
@RequestMapping("/api/trainers")
@CrossOrigin(origins = "*")
public class TrainerController {
    
    @Autowired
    private TrainerRepository trainerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    private static final String PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#";
    private final SecureRandom secureRandom = new SecureRandom();
    
    @GetMapping
    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Trainer> getTrainerById(@PathVariable String id) {
        Trainer trainer = trainerRepository.findById(id).orElse(null);
        if (trainer != null) {
            return ResponseEntity.ok(trainer);
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createTrainer(@RequestBody Map<String, Object> requestData) {
        try {
            // Extract trainer data
            Trainer trainer = new Trainer();
            if (requestData.containsKey("id")) trainer.setId((String) requestData.get("id"));
            if (requestData.containsKey("name")) trainer.setName((String) requestData.get("name"));
            if (requestData.containsKey("age")) {
                Object age = requestData.get("age");
                if (age instanceof Number) {
                    trainer.setAge(((Number) age).intValue());
                } else if (age instanceof String && !((String) age).isEmpty()) {
                    trainer.setAge(Integer.parseInt((String) age));
                }
            }
            if (requestData.containsKey("gender")) trainer.setGender((String) requestData.get("gender"));
            if (requestData.containsKey("specialization")) trainer.setSpecialization((String) requestData.get("specialization"));
            if (requestData.containsKey("experience")) {
                Object exp = requestData.get("experience");
                if (exp instanceof Number) {
                    trainer.setExperience(((Number) exp).intValue());
                } else if (exp instanceof String && !((String) exp).isEmpty()) {
                    trainer.setExperience(Integer.parseInt((String) exp));
                }
            }
            if (requestData.containsKey("salary")) {
                Object salary = requestData.get("salary");
                if (salary instanceof Number) {
                    trainer.setSalary(((Number) salary).doubleValue());
                }
            }
            if (requestData.containsKey("contact")) trainer.setContact((String) requestData.get("contact"));
            if (requestData.containsKey("email")) trainer.setEmail((String) requestData.get("email"));
            if (requestData.containsKey("address")) trainer.setAddress((String) requestData.get("address"));
            if (requestData.containsKey("joinDate")) {
                String dateStr = (String) requestData.get("joinDate");
                if (dateStr != null && !dateStr.isEmpty()) {
                    try {
                        trainer.setJoinDate(java.sql.Date.valueOf(dateStr));
                    } catch (Exception e) {
                        // Use current date if parsing fails
                        trainer.setJoinDate(new java.sql.Date(System.currentTimeMillis()));
                    }
                }
            }
            
            // Extract custom username/password (optional)
            String customUsername = requestData.containsKey("username") ? (String) requestData.get("username") : null;
            String customPassword = requestData.containsKey("password") ? (String) requestData.get("password") : null;
            
            Trainer savedTrainer = trainerRepository.save(trainer);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("trainer", savedTrainer);
            
            Map<String, String> credentials = ensureTrainerCredentials(savedTrainer, customUsername, customPassword);
            if (!credentials.isEmpty()) {
                response.put("credentials", credentials);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTrainer(@PathVariable String id, @RequestBody Trainer trainer) {
        try {
            trainer.setId(id);
            Trainer updatedTrainer = trainerRepository.save(trainer);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("trainer", updatedTrainer);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTrainer(@PathVariable String id) {
        try {
            trainerRepository.deleteById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Trainer deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/search")
    public List<Trainer> searchTrainers(@RequestParam String query) {
        return trainerRepository.findByNameContaining(query);
    }
    
    private Map<String, String> ensureTrainerCredentials(Trainer trainer, String customUsername, String customPassword) {
        Map<String, String> credentials = new HashMap<>();
        Optional<User> existingUser = userRepository.findByTrainerId(trainer.getId());
        if (existingUser.isPresent()) {
            credentials.put("username", existingUser.get().getUsername());
            return credentials;
        }
        
        String username;
        String password;
        
        // Use custom username/password if provided, otherwise generate
        if (customUsername != null && !customUsername.trim().isEmpty()) {
            // Check if username already exists
            if (userRepository.findByUsername(customUsername.trim()).isPresent()) {
                // If exists, generate unique one
                username = generateUniqueUsername(customUsername.trim());
            } else {
                username = customUsername.trim();
            }
        } else {
            String base = "trainer" + trainer.getId();
            username = generateUniqueUsername(base);
        }
        
        if (customPassword != null && !customPassword.trim().isEmpty()) {
            password = customPassword.trim();
        } else {
            password = generateTempPassword();
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setRole(User.Role.trainer);
        user.setTrainerId(trainer.getId());
        userRepository.save(user);
        
        credentials.put("username", username);
        credentials.put("password", password);
        return credentials;
    }
    
    private String generateUniqueUsername(String base) {
        String sanitized = base.replaceAll("\\s+", "").toLowerCase();
        String username = sanitized;
        int counter = 1;
        while (userRepository.findByUsername(username).isPresent()) {
            username = sanitized + counter;
            counter++;
        }
        return username;
    }
    
    private String generateTempPassword() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 8; i++) {
            int index = secureRandom.nextInt(PASSWORD_CHARS.length());
            sb.append(PASSWORD_CHARS.charAt(index));
        }
        return sb.toString();
    }
}

