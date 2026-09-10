package com.mycompany.gymmanagementsystem.controller;

import com.mycompany.gymmanagementsystem.model.Feedback;
import com.mycompany.gymmanagementsystem.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createFeedback(@RequestBody Map<String, Object> requestData) {
        try {
            Feedback feedback = new Feedback();
            feedback.setFromRole((String) requestData.get("fromRole"));
            feedback.setFromUserId((String) requestData.get("fromUserId"));
            feedback.setToRole((String) requestData.get("toRole"));
            feedback.setToUserId((String) requestData.get("toUserId"));
            feedback.setToMemberId((String) requestData.get("toMemberId"));
            feedback.setToTrainerId((String) requestData.get("toTrainerId"));
            feedback.setSubject((String) requestData.get("subject"));
            feedback.setMessage((String) requestData.get("message"));
            feedback.setStatus("unread");

            Feedback saved = feedbackRepository.save(feedback);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Feedback sent successfully");
            response.put("feedback", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error sending feedback: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Feedback>> getFeedbackForMember(@PathVariable String memberId) {
        List<Feedback> feedbacks = feedbackRepository.findByToMemberId(memberId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<Feedback>> getFeedbackForTrainer(@PathVariable String trainerId) {
        List<Feedback> feedbacks = feedbackRepository.findByToTrainerId(trainerId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        List<Feedback> feedbacks = feedbackRepository.findAll();
        return ResponseEntity.ok(feedbacks);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(@PathVariable Integer id) {
        try {
            Feedback feedback = feedbackRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Feedback not found"));
            feedback.setStatus("read");
            feedbackRepository.save(feedback);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Feedback marked as read");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

