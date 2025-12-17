package com.mycompany.gymmanagementsystem.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "trainer")
public class Trainer {
    @Id
    @Column(name = "trainer_id")
    private String id;
    
    private String name;
    private Integer age;
    private String gender;
    private String specialization;
    private Integer experience;
    private Double salary;
    private String contact;
    private String email;
    private String address;
    
    @Column(name = "join_date")
    private Date joinDate;
    
    @Column(name = "assigned_members")
    private Integer assignedMembers;
    
    @Enumerated(EnumType.STRING)
    private Status status;
    
    @Column(name = "created_at")
    private Date createdAt;
    
    public enum Status {
        active, inactive
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Integer getAge() {
        return age;
    }
    
    public void setAge(Integer age) {
        this.age = age;
    }
    
    public String getGender() {
        return gender;
    }
    
    public void setGender(String gender) {
        this.gender = gender;
    }
    
    public String getSpecialization() {
        return specialization;
    }
    
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
    
    public Integer getExperience() {
        return experience;
    }
    
    public void setExperience(Integer experience) {
        this.experience = experience;
    }
    
    public Double getSalary() {
        return salary;
    }
    
    public void setSalary(Double salary) {
        this.salary = salary;
    }
    
    public String getContact() {
        return contact;
    }
    
    public void setContact(String contact) {
        this.contact = contact;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public Date getJoinDate() {
        return joinDate;
    }
    
    public void setJoinDate(Date joinDate) {
        this.joinDate = joinDate;
    }
    
    public Integer getAssignedMembers() {
        return assignedMembers;
    }
    
    public void setAssignedMembers(Integer assignedMembers) {
        this.assignedMembers = assignedMembers;
    }
    
    public Status getStatus() {
        return status;
    }
    
    public void setStatus(Status status) {
        this.status = status;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
