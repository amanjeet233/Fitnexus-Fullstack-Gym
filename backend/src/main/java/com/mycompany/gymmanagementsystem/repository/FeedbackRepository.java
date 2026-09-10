package com.mycompany.gymmanagementsystem.repository;

import com.mycompany.gymmanagementsystem.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {
    List<Feedback> findByToMemberId(String memberId);
    List<Feedback> findByToTrainerId(String trainerId);
    List<Feedback> findByToUserId(String userId);
    List<Feedback> findByToRole(String role);
    List<Feedback> findByStatus(String status);
}

