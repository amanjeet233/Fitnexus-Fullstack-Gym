package com.mycompany.gymmanagementsystem.repository;

import com.mycompany.gymmanagementsystem.model.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemberRepository extends JpaRepository<Member, String> {
    @Query(value = "SELECT MAX(CAST(SUBSTRING(member_id, 3) AS UNSIGNED)) FROM member WHERE member_id LIKE '00%'", nativeQuery = true)
    Integer findMaxIdNumber();
    
    List<Member> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
    List<Member> findByTrainerId(String trainerId);
    List<Member> findByStatus(String status);
}

