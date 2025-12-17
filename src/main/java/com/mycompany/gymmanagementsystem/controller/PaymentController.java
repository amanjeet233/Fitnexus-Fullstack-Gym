package com.mycompany.gymmanagementsystem.controller;

import com.mycompany.gymmanagementsystem.model.Member;
import com.mycompany.gymmanagementsystem.model.Payment;
import com.mycompany.gymmanagementsystem.repository.MemberRepository;
import com.mycompany.gymmanagementsystem.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    @GetMapping
    public List<Payment> getAllPayments() {
        List<Payment> payments = paymentRepository.findAll();
        updatePaymentStatus(payments);
        return payments;
    }
    
    @GetMapping("/member/{memberId}")
    public ResponseEntity<List<Payment>> getPaymentsByMemberId(@PathVariable String memberId) {
        // Try different ID formats
        List<Payment> payments = paymentRepository.findByMemberId(memberId);
        if (payments.isEmpty() && !memberId.startsWith("00")) {
            payments = paymentRepository.findByMemberId("00" + memberId);
        } else if (payments.isEmpty() && memberId.startsWith("00")) {
            payments = paymentRepository.findByMemberId(memberId.substring(2));
        }
        
        updatePaymentStatus(payments);
        return ResponseEntity.ok(payments);
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> createPayment(@RequestBody Payment payment) {
        try {
            // Calculate due date (30 days from payment date)
            if (payment.getPaymentDate() != null && payment.getDueDate() == null) {
                Calendar cal = Calendar.getInstance();
                cal.setTime(payment.getPaymentDate());
                cal.add(Calendar.DAY_OF_MONTH, 30);
                payment.setDueDate(cal.getTime());
            }
            
            // Calculate days remaining and status
            calculatePaymentStatus(payment);
            
            Payment savedPayment = paymentRepository.save(payment);
            
            // Update member's payment date and fees status
            if (payment.getMemberId() != null) {
                Member member = memberRepository.findById(payment.getMemberId()).orElse(null);
                if (member == null && !payment.getMemberId().startsWith("00")) {
                    member = memberRepository.findById("00" + payment.getMemberId()).orElse(null);
                } else if (member == null && payment.getMemberId().startsWith("00")) {
                    member = memberRepository.findById(payment.getMemberId().substring(2)).orElse(null);
                }
                if (member != null && payment.getPaymentDate() != null) {
                    member.setPaymentDate(payment.getPaymentDate());
                    member.setFeesStatus("Paid");
                    memberRepository.save(member);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("payment", savedPayment);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updatePayment(@PathVariable Integer id, @RequestBody Payment payment) {
        try {
            Payment existingPayment = paymentRepository.findById(id).orElse(null);
            if (existingPayment == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Payment not found");
                return ResponseEntity.notFound().build();
            }
            
            payment.setPaymentId(id);
            calculatePaymentStatus(payment);
            Payment updatedPayment = paymentRepository.save(payment);
            
            // Update member's payment date and fees status
            if (updatedPayment.getMemberId() != null) {
                Member member = memberRepository.findById(updatedPayment.getMemberId()).orElse(null);
                if (member == null && !updatedPayment.getMemberId().startsWith("00")) {
                    member = memberRepository.findById("00" + updatedPayment.getMemberId()).orElse(null);
                } else if (member == null && updatedPayment.getMemberId().startsWith("00")) {
                    member = memberRepository.findById(updatedPayment.getMemberId().substring(2)).orElse(null);
                }
                
                if (member != null) {
                    // Update payment date if provided
                    if (updatedPayment.getPaymentDate() != null) {
                        member.setPaymentDate(updatedPayment.getPaymentDate());
                        member.setFeesStatus("Paid");
                    } else {
                        // If payment date is removed, set status to Unpaid
                        member.setFeesStatus("Unpaid");
                    }
                    memberRepository.save(member);
                }
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("payment", updatedPayment);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePayment(@PathVariable Integer id) {
        try {
            paymentRepository.deleteById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Payment deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    private void updatePaymentStatus(List<Payment> payments) {
        for (Payment payment : payments) {
            calculatePaymentStatus(payment);
            paymentRepository.save(payment);
            
            // Also update member's fees status based on payment
            if (payment.getMemberId() != null && payment.getPaymentDate() != null) {
                Member member = memberRepository.findById(payment.getMemberId()).orElse(null);
                if (member == null && !payment.getMemberId().startsWith("00")) {
                    member = memberRepository.findById("00" + payment.getMemberId()).orElse(null);
                } else if (member == null && payment.getMemberId().startsWith("00")) {
                    member = memberRepository.findById(payment.getMemberId().substring(2)).orElse(null);
                }
                if (member != null) {
                    member.setPaymentDate(payment.getPaymentDate());
                    member.setFeesStatus("Paid");
                    memberRepository.save(member);
                }
            }
        }
    }
    
    private void calculatePaymentStatus(Payment payment) {
        if (payment.getDueDate() == null) {
            payment.setDayRemaining("N/A");
            payment.setStatus("Not Paid");
            return;
        }
        
        Date today = new Date();
        long diff = payment.getDueDate().getTime() - today.getTime();
        long daysDiff = diff / (1000 * 60 * 60 * 24);
        
        if (daysDiff < 0) {
            payment.setDayRemaining("Overdue");
            payment.setStatus("Overdue");
        } else if (daysDiff == 0) {
            payment.setDayRemaining("0");
            payment.setStatus("Due Today");
        } else {
            payment.setDayRemaining(String.valueOf(daysDiff));
            if (daysDiff <= 7) {
                payment.setStatus("Due Soon");
            } else {
                payment.setStatus("Active");
            }
        }
    }
}

