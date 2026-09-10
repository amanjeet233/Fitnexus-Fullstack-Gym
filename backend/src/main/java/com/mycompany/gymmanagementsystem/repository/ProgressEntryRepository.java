package com.mycompany.gymmanagementsystem.repository;

import com.mycompany.gymmanagementsystem.model.ProgressEntry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProgressEntryRepository extends JpaRepository<ProgressEntry, Long> {
    List<ProgressEntry> findByTrainerIdOrderByRecordedAtDesc(String trainerId);
    List<ProgressEntry> findByMemberIdOrderByRecordedAtDesc(String memberId);
}


