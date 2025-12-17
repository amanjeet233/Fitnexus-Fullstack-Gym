package com.mycompany.gymmanagementsystem.repository;

import com.mycompany.gymmanagementsystem.model.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    List<WorkoutPlan> findByTrainerIdOrderBySessionDateAsc(String trainerId);
    List<WorkoutPlan> findByMemberIdOrderBySessionDateAsc(String memberId);
}


