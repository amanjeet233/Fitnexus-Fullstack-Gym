package com.mycompany.gymmanagementsystem.controller;

import com.mycompany.gymmanagementsystem.model.Attendance;
import com.mycompany.gymmanagementsystem.model.Member;
import com.mycompany.gymmanagementsystem.repository.AttendanceRepository;
import com.mycompany.gymmanagementsystem.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Profile("db")
@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {
    
    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Attendance>> getMemberAttendance(@PathVariable String memberId) {
        List<Attendance> attendance = attendanceRepository.findByMemberId(memberId);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/trainer/{trainerId}")
    public ResponseEntity<List<Attendance>> getTrainerAttendance(@PathVariable String trainerId) {
        List<Attendance> attendance = attendanceRepository.findByTrainerId(trainerId);
        return ResponseEntity.ok(attendance);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> markAttendance(@RequestBody Map<String, Object> data) {
        try {
            String memberId = (String) data.get("memberId");
            String trainerId = (String) data.get("trainerId");
            
            // Validate memberId is not null
            if (memberId == null || memberId.trim().isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Member ID is required");
                return ResponseEntity.badRequest().body(response);
            }
            
            Date attendanceDate = new Date(); // Use provided date or today
            
            if (data.get("attendanceDate") != null) {
                // Parse date string if provided (format: "yyyy-MM-dd")
                String dateStr = (String) data.get("attendanceDate");
                if (dateStr != null && !dateStr.isEmpty()) {
                    try {
                        attendanceDate = java.sql.Date.valueOf(dateStr);
                    } catch (Exception e) {
                        // If parsing fails, use today's date
                        attendanceDate = new Date();
                    }
                }
            }
            
            String statusStr = (String) data.get("status");
            Attendance.Status status = Attendance.Status.present;
            if (statusStr != null) {
                try {
                    status = Attendance.Status.valueOf(statusStr);
                } catch (Exception e) {
                    status = Attendance.Status.present;
                }
            }
            
            // Check if already marked for today
            if (attendanceRepository.existsByMemberIdAndAttendanceDate(memberId, attendanceDate)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Attendance already marked for this date");
                return ResponseEntity.badRequest().body(response);
            }
            
            Attendance attendance = new Attendance();
            attendance.setMemberId(memberId);
            attendance.setTrainerId(trainerId);
            attendance.setAttendanceDate(attendanceDate);
            attendance.setStatus(status);
            attendance.setCreatedAt(new Date());
            
            Attendance saved = attendanceRepository.save(attendance);
            
            // Update member attendance count
            Optional<Member> memberOpt = memberRepository.findById(memberId);
            if (memberOpt.isPresent()) {
                Member member = memberOpt.get();
                member.setAttendanceCount((member.getAttendanceCount() != null ? member.getAttendanceCount() : 0) + 1);
                memberRepository.save(member);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("attendance", saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/stats/{memberId}")
    public ResponseEntity<Map<String, Object>> getAttendanceStats(@PathVariable String memberId) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.DAY_OF_MONTH, 1);
        Date startDate = cal.getTime();
        Date endDate = new Date();
        
        List<Attendance> attendance = attendanceRepository.findByMemberIdAndAttendanceDateBetween(
            memberId, startDate, endDate);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalDays", attendance.size());
        stats.put("presentDays", attendance.stream()
            .filter(a -> a.getStatus() == Attendance.Status.present).count());
        stats.put("absentDays", attendance.stream()
            .filter(a -> a.getStatus() == Attendance.Status.absent).count());
        stats.put("lateDays", attendance.stream()
            .filter(a -> a.getStatus() == Attendance.Status.late).count());
        stats.put("attendance", attendance);
        
        return ResponseEntity.ok(stats);
    }
}

