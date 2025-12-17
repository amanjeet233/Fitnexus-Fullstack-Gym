package com.mycompany.gymmanagementsystem.controller;

import com.mycompany.gymmanagementsystem.model.ProgressEntry;
import com.mycompany.gymmanagementsystem.repository.ProgressEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Profile("db")
@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "*")
public class ProgressEntryController {

    @Autowired
    private ProgressEntryRepository progressEntryRepository;

    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<ProgressEntry>> getByTrainer(@PathVariable String trainerId) {
        return ResponseEntity.ok(progressEntryRepository.findByTrainerIdOrderByRecordedAtDesc(trainerId));
    }

    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<ProgressEntry>> getByMember(@PathVariable String memberId) {
        return ResponseEntity.ok(progressEntryRepository.findByMemberIdOrderByRecordedAtDesc(memberId));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createEntry(@RequestBody ProgressEntry entry) {
        Map<String, Object> response = new HashMap<>();
        try {
            if (entry.getMemberId() == null || entry.getTrainerId() == null) {
                response.put("success", false);
                response.put("message", "Member ID and Trainer ID are required");
                return ResponseEntity.badRequest().body(response);
            }

            if (entry.getRecordedAt() == null) {
                entry.setRecordedAt(new Date());
            }

            ProgressEntry saved = progressEntryRepository.save(entry);
            response.put("success", true);
            response.put("progress", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PutMapping("/{progressId}")
    public ResponseEntity<Map<String, Object>> updateEntry(@PathVariable Long progressId, @RequestBody ProgressEntry entry) {
        Map<String, Object> response = new HashMap<>();
        Optional<ProgressEntry> existingOpt = progressEntryRepository.findById(progressId);
        if (!existingOpt.isPresent()) {
            response.put("success", false);
            response.put("message", "Progress entry not found");
            return ResponseEntity.status(404).body(response);
        }

        try {
            ProgressEntry existing = existingOpt.get();
            existing.setMetric(entry.getMetric());
            existing.setValue(entry.getValue());
            existing.setNotes(entry.getNotes());
            existing.setRecordedAt(entry.getRecordedAt() != null ? entry.getRecordedAt() : existing.getRecordedAt());

            ProgressEntry saved = progressEntryRepository.save(existing);
            response.put("success", true);
            response.put("progress", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{progressId}")
    public ResponseEntity<Map<String, Object>> deleteEntry(@PathVariable Long progressId) {
        Map<String, Object> response = new HashMap<>();
        if (!progressEntryRepository.existsById(progressId)) {
            response.put("success", false);
            response.put("message", "Progress entry not found");
            return ResponseEntity.status(404).body(response);
        }

        progressEntryRepository.deleteById(progressId);
        response.put("success", true);
        response.put("message", "Progress entry deleted");
        return ResponseEntity.ok(response);
    }
}


