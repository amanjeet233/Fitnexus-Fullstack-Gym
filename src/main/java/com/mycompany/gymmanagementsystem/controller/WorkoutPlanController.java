package com.mycompany.gymmanagementsystem.controller;

import com.mycompany.gymmanagementsystem.model.WorkoutPlan;
import com.mycompany.gymmanagementsystem.repository.WorkoutPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Profile("db")
@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*")
public class WorkoutPlanController {

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<WorkoutPlan>> getByTrainer(@PathVariable String trainerId) {
        return ResponseEntity.ok(workoutPlanRepository.findByTrainerIdOrderBySessionDateAsc(trainerId));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<WorkoutPlan>> getByMember(@PathVariable String memberId) {
        return ResponseEntity.ok(workoutPlanRepository.findByMemberIdOrderBySessionDateAsc(memberId));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPlan(@RequestBody WorkoutPlan plan) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (plan.getTrainerId() == null || plan.getMemberId() == null) {
                response.put("success", false);
                response.put("message", "Trainer ID and Member ID are required");
                return ResponseEntity.badRequest().body(response);
            }

            if (plan.getCreatedAt() == null) {
                plan.setCreatedAt(new Date());
            }

            WorkoutPlan saved = workoutPlanRepository.save(plan);
            response.put("success", true);
            response.put("workout", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{planId}")
    public ResponseEntity<Map<String, Object>> updatePlan(@PathVariable Long planId, @RequestBody WorkoutPlan plan) {
        Map<String, Object> response = new HashMap<>();
        Optional<WorkoutPlan> existingOpt = workoutPlanRepository.findById(planId);
        if (!existingOpt.isPresent()) {
            response.put("success", false);
            response.put("message", "Workout plan not found");
            return ResponseEntity.status(404).body(response);
        }

        try {
            WorkoutPlan existing = existingOpt.get();
            existing.setTitle(plan.getTitle());
            existing.setFocusArea(plan.getFocusArea());
            existing.setSessionDate(plan.getSessionDate());
            existing.setStartTime(plan.getStartTime());
            existing.setEndTime(plan.getEndTime());
            existing.setNotes(plan.getNotes());

            WorkoutPlan saved = workoutPlanRepository.save(existing);
            response.put("success", true);
            response.put("workout", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{planId}")
    public ResponseEntity<Map<String, Object>> deletePlan(@PathVariable Long planId) {
        Map<String, Object> response = new HashMap<>();
        if (!workoutPlanRepository.existsById(planId)) {
            response.put("success", false);
            response.put("message", "Workout plan not found");
            return ResponseEntity.status(404).body(response);
        }

        workoutPlanRepository.deleteById(planId);
        response.put("success", true);
        response.put("message", "Workout plan deleted");
        return ResponseEntity.ok(response);
    }
}


