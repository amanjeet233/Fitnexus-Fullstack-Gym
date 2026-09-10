package com.mycompany.gymmanagementsystem.repository;

import com.mycompany.gymmanagementsystem.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    List<Attendance> findByMemberId(String memberId);
    List<Attendance> findByTrainerId(String trainerId);
    List<Attendance> findByMemberIdAndAttendanceDateBetween(String memberId, Date startDate, Date endDate);
    boolean existsByMemberIdAndAttendanceDate(String memberId, Date date);
}

