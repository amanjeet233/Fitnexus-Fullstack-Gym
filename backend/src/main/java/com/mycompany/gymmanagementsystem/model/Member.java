package com.mycompany.gymmanagementsystem.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "member")
public class Member {
    @Id
    @Column(name = "member_id")
    private String id;
    
    private String name;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    private Integer age;
    private String gender;
    
    @Column(name = "phone_num")
    private String phoneNum;
    
    private String contact;
    private String email;
    private String address;
    
    @Column(name = "plan_id")
    private Integer planId;
    
    @Column(name = "trainer_id")
    private String trainerId;
    
    @Column(name = "member_type")
    private String memberType;
    
    @Column(name = "amount_pay")
    private Double amountPay;
    
    @Column(name = "date_registered")
    private Date dateRegistered;
    
    @Column(name = "expiry_date")
    private Date expiryDate;
    
    @Column(name = "payment_date")
    private Date paymentDate;
    
    @Column(name = "fees_status")
    private String feesStatus;
    
    @Column(name = "attendance_count")
    private Integer attendanceCount;
    
    private String status;
    
    @Column(name = "created_at")
    private Date createdAt;
    
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
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
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
    
    public String getPhoneNum() {
        return phoneNum;
    }
    
    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
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
    
    public Integer getPlanId() {
        return planId;
    }
    
    public void setPlanId(Integer planId) {
        this.planId = planId;
    }
    
    public String getTrainerId() {
        return trainerId;
    }
    
    public void setTrainerId(String trainerId) {
        this.trainerId = trainerId;
    }
    
    public String getMemberType() {
        return memberType;
    }
    
    public void setMemberType(String memberType) {
        this.memberType = memberType;
    }
    
    public Double getAmountPay() {
        return amountPay;
    }
    
    public void setAmountPay(Double amountPay) {
        this.amountPay = amountPay;
    }
    
    public Date getDateRegistered() {
        return dateRegistered;
    }
    
    public void setDateRegistered(Date dateRegistered) {
        this.dateRegistered = dateRegistered;
    }
    
    public Date getExpiryDate() {
        return expiryDate;
    }
    
    public void setExpiryDate(Date expiryDate) {
        this.expiryDate = expiryDate;
    }
    
    public Date getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public String getFeesStatus() {
        return feesStatus;
    }
    
    public void setFeesStatus(String feesStatus) {
        this.feesStatus = feesStatus;
    }
    
    public Integer getAttendanceCount() {
        return attendanceCount;
    }
    
    public void setAttendanceCount(Integer attendanceCount) {
        this.attendanceCount = attendanceCount;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
