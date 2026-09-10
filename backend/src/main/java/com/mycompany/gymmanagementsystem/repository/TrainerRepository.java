package com.mycompany.gymmanagementsystem.repository;

import com.mycompany.gymmanagementsystem.model.Trainer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, String> {
    List<Trainer> findByNameContaining(String name);
}

