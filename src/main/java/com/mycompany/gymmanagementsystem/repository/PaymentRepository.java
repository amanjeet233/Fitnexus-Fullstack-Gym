package com.mycompany.gymmanagementsystem.repository;

import com.mycompany.gymmanagementsystem.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByMemberId(String memberId);
}

