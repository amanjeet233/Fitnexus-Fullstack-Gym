package com.mycompany.gymmanagementsystem.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "attendance")
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "attendance_id")
    private Integer attendanceId;
    
    @Column(name = "member_id", nullable = false)
    private String memberId;
    
    @Column(name = "trainer_id")
    private String trainerId;
    
    @Column(name = "attendance_date", nullable = false)
    private Date attendanceDate;
    
    @Column(name = "check_in_time")
    private String checkInTime;
    
    @Column(name = "check_out_time")
    private String checkOutTime;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    private String notes;
    
    @Column(name = "created_at")
    private Date createdAt;
    
    public enum Status {
        present, absent, late
    }
    
    // Getters and Setters
    public Integer getAttendanceId() {
        return attendanceId;
    }
    
    public void setAttendanceId(Integer attendanceId) {
        this.attendanceId = attendanceId;
    }
    
    public String getMemberId() {
        return memberId;
    }
    
    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }
    
    public String getTrainerId() {
        return trainerId;
    }
    
    public void setTrainerId(String trainerId) {
        this.trainerId = trainerId;
    }
    
    public Date getAttendanceDate() {
        return attendanceDate;
    }
    
    public void setAttendanceDate(Date attendanceDate) {
        this.attendanceDate = attendanceDate;
    }
    
    public String getCheckInTime() {
        return checkInTime;
    }
    
    public void setCheckInTime(String checkInTime) {
        this.checkInTime = checkInTime;
    }
    
    public String getCheckOutTime() {
        return checkOutTime;
    }
    
    public void setCheckOutTime(String checkOutTime) {
        this.checkOutTime = checkOutTime;
    }
    
    public Status getStatus() {
        return status;
    }
    
    public void setStatus(Status status) {
        this.status = status;
    }
    
    public String getNotes() {
        return notes;
    }
    
    public void setNotes(String notes) {
        this.notes = notes;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}

