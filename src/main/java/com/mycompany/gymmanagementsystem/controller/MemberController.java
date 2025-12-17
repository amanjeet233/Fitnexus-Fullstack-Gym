package com.mycompany.gymmanagementsystem.controller;

import com.mycompany.gymmanagementsystem.model.Member;
import com.mycompany.gymmanagementsystem.model.User;
import com.mycompany.gymmanagementsystem.repository.MemberRepository;
import com.mycompany.gymmanagementsystem.repository.TrainerRepository;
import com.mycompany.gymmanagementsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.util.*;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "*")
public class MemberController {
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TrainerRepository trainerRepository;
    
    private static final String PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#";
    private final SecureRandom secureRandom = new SecureRandom();
    
    @GetMapping
    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable String id) {
        // Try with and without "00" prefix
        Optional<Member> memberOpt = memberRepository.findById(id);
        if (!memberOpt.isPresent() && !id.startsWith("00")) {
            memberOpt = memberRepository.findById("00" + id);
        } else if (!memberOpt.isPresent() && id.startsWith("00")) {
            memberOpt = memberRepository.findById(id.substring(2));
        }
        
        if (memberOpt.isPresent()) {
            return ResponseEntity.ok(memberOpt.get());
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<Member>> getMembersByTrainer(@PathVariable String trainerId) {
        List<Member> members = memberRepository.findByTrainerId(trainerId);
        return ResponseEntity.ok(members);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createMember(@RequestBody Map<String, Object> requestData) {
        try {
            // Extract member data
            Member member = new Member();
            if (requestData.containsKey("firstName")) member.setFirstName((String) requestData.get("firstName"));
            if (requestData.containsKey("lastName")) member.setLastName((String) requestData.get("lastName"));
            if (requestData.containsKey("gender")) member.setGender((String) requestData.get("gender"));
            if (requestData.containsKey("phoneNum")) member.setPhoneNum((String) requestData.get("phoneNum"));
            if (requestData.containsKey("email")) member.setEmail((String) requestData.get("email"));
            if (requestData.containsKey("address")) member.setAddress((String) requestData.get("address"));
            if (requestData.containsKey("memberType")) member.setMemberType((String) requestData.get("memberType"));
            if (requestData.containsKey("amountPay")) {
                Object amount = requestData.get("amountPay");
                if (amount instanceof Number) {
                    member.setAmountPay(((Number) amount).doubleValue());
                }
            }
            if (requestData.containsKey("trainerId")) {
                String trainerId = (String) requestData.get("trainerId");
                if (trainerId != null && !trainerId.trim().isEmpty()) {
                    member.setTrainerId(trainerId);
                }
            }
            if (requestData.containsKey("dateRegistered")) {
                String dateStr = (String) requestData.get("dateRegistered");
                if (dateStr != null) {
                    try {
                        member.setDateRegistered(java.sql.Date.valueOf(dateStr));
                    } catch (Exception e) {
                        // Use current date if parsing fails
                        member.setDateRegistered(new Date());
                    }
                }
            }
            
            // Extract custom username/password (optional)
            String customUsername = requestData.containsKey("username") ? (String) requestData.get("username") : null;
            String customPassword = requestData.containsKey("password") ? (String) requestData.get("password") : null;
            
            // Generate ID if not provided
            if (member.getId() == null || member.getId().isEmpty()) {
                Integer maxId = memberRepository.findMaxIdNumber();
                if (maxId == null) maxId = 0;
                member.setId(String.format("00%d", maxId + 1));
            }
            
            // Set name from first and last name
            if (member.getName() == null && member.getFirstName() != null) {
                member.setName((member.getFirstName() + " " + 
                    (member.getLastName() != null ? member.getLastName() : "")).trim());
            }
            
            if (member.getDateRegistered() == null) {
                member.setDateRegistered(new Date());
            }
            
            if (member.getTrainerId() != null && member.getTrainerId().trim().isEmpty()) {
                member.setTrainerId(null);
            }
            if (member.getTrainerId() != null && !trainerRepository.existsById(member.getTrainerId())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Trainer ID " + member.getTrainerId() + " does not exist. Create the trainer first.");
                return ResponseEntity.badRequest().body(response);
            }
            
            // Set default values
            if (member.getAttendanceCount() == null) {
                member.setAttendanceCount(0);
            }
            if (member.getFeesStatus() == null) {
                member.setFeesStatus("Unpaid");
            }
            if (member.getStatus() == null) {
                member.setStatus("active");
            }
            if (member.getCreatedAt() == null) {
                member.setCreatedAt(new Date());
            }
            
            // Calculate expiry date (30 days from registration)
            if (member.getExpiryDate() == null && member.getDateRegistered() != null) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(member.getDateRegistered());
                cal.add(Calendar.DAY_OF_MONTH, 30);
                member.setExpiryDate(cal.getTime());
            }
            
            Member savedMember = memberRepository.save(member);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("member", savedMember);
            
            Map<String, String> credentials = ensureMemberCredentials(savedMember, customUsername, customPassword);
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
    public ResponseEntity<Map<String, Object>> updateMember(@PathVariable String id, @RequestBody Member member) {
        try {
            // Try to find member with different ID formats
            Member existingMember = memberRepository.findById(id).orElse(null);
            if (existingMember == null && !id.startsWith("00")) {
                existingMember = memberRepository.findById("00" + id).orElse(null);
            } else if (existingMember == null && id.startsWith("00")) {
                existingMember = memberRepository.findById(id.substring(2)).orElse(null);
            }
            
            if (existingMember == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Member not found");
                return ResponseEntity.notFound().build();
            }
            
            // Update only provided fields, preserve existing values for others
            if (member.getFirstName() != null) {
                existingMember.setFirstName(member.getFirstName());
            }
            if (member.getLastName() != null) {
                existingMember.setLastName(member.getLastName());
            }
            if (member.getName() != null) {
                existingMember.setName(member.getName());
            } else if (member.getFirstName() != null) {
                // Update name from first and last name
                String newName = (member.getFirstName() + " " + 
                    (member.getLastName() != null ? member.getLastName() : 
                     (existingMember.getLastName() != null ? existingMember.getLastName() : ""))).trim();
                existingMember.setName(newName);
            }
            if (member.getGender() != null) {
                existingMember.setGender(member.getGender());
            }
            if (member.getPhoneNum() != null) {
                existingMember.setPhoneNum(member.getPhoneNum());
            }
            if (member.getContact() != null) {
                existingMember.setContact(member.getContact());
            }
            if (member.getEmail() != null) {
                existingMember.setEmail(member.getEmail());
            }
            if (member.getAddress() != null) {
                existingMember.setAddress(member.getAddress());
            }
            if (member.getMemberType() != null) {
                existingMember.setMemberType(member.getMemberType());
            }
            if (member.getAmountPay() != null) {
                existingMember.setAmountPay(member.getAmountPay());
            }
            if (member.getTrainerId() != null) {
                if (member.getTrainerId().trim().isEmpty()) {
                    existingMember.setTrainerId(null);
                } else {
                    // Validate trainer exists
                    if (trainerRepository.existsById(member.getTrainerId())) {
                        existingMember.setTrainerId(member.getTrainerId());
                    } else {
                        Map<String, Object> response = new HashMap<>();
                        response.put("success", false);
                        response.put("message", "Trainer ID " + member.getTrainerId() + " does not exist.");
                        return ResponseEntity.badRequest().body(response);
                    }
                }
            }
            if (member.getDateRegistered() != null) {
                existingMember.setDateRegistered(member.getDateRegistered());
            }
            if (member.getExpiryDate() != null) {
                existingMember.setExpiryDate(member.getExpiryDate());
            }
            if (member.getPaymentDate() != null) {
                existingMember.setPaymentDate(member.getPaymentDate());
            }
            if (member.getFeesStatus() != null) {
                existingMember.setFeesStatus(member.getFeesStatus());
            }
            if (member.getAttendanceCount() != null) {
                existingMember.setAttendanceCount(member.getAttendanceCount());
            }
            if (member.getStatus() != null) {
                existingMember.setStatus(member.getStatus());
            }
            
            Member updatedMember = memberRepository.save(existingMember);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("member", updatedMember);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteMember(@PathVariable String id) {
        try {
            Member member = memberRepository.findById(id).orElse(null);
            if (member == null && !id.startsWith("00")) {
                member = memberRepository.findById("00" + id).orElse(null);
            } else if (member == null && id.startsWith("00")) {
                member = memberRepository.findById(id.substring(2)).orElse(null);
            }
            
            if (member != null) {
                memberRepository.delete(member);
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Member deleted successfully");
                return ResponseEntity.ok(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Member not found");
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/search")
    public List<Member> searchMembers(@RequestParam String query) {
        return memberRepository.findByFirstNameContainingOrLastNameContaining(query, query);
    }
    
    private Map<String, String> ensureMemberCredentials(Member member, String customUsername, String customPassword) {
        Map<String, String> credentials = new HashMap<>();
        Optional<User> existingUser = userRepository.findByMemberId(member.getId());
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
            username = generateUniqueUsername("member" + member.getId());
        }
        
        if (customPassword != null && !customPassword.trim().isEmpty()) {
            password = customPassword.trim();
        } else {
            password = generateTempPassword();
        }
        
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        user.setRole(User.Role.member);
        user.setMemberId(member.getId());
        userRepository.save(user);
        
        credentials.put("username", username);
        credentials.put("password", password);
        return credentials;
    }
    
    private String generateUniqueUsername(String base) {
        String username = base.toLowerCase();
        int counter = 1;
        while (userRepository.findByUsername(username).isPresent()) {
            username = (base + counter).toLowerCase();
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

