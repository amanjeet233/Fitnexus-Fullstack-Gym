package com.mycompany.gymmanagementsystem.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "payment")
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Integer paymentId;
    
    @Column(name = "ID")
    private String memberId;
    
    @Column(name = "memberName")
    private String memberName;
    
    @Column(name = "memberType")
    private String memberType;
    
    @Column(name = "amountPay")
    private Double amountPay;
    
    @Column(name = "paymentDate")
    private Date paymentDate;
    
    @Column(name = "dueDate")
    private Date dueDate;
    
    @Column(name = "dayRemaining")
    private String dayRemaining;
    
    private String status;
    
    // Getters and Setters
    public Integer getPaymentId() {
        return paymentId;
    }
    
    public void setPaymentId(Integer paymentId) {
        this.paymentId = paymentId;
    }
    
    public String getMemberId() {
        return memberId;
    }
    
    public void setMemberId(String memberId) {
        this.memberId = memberId;
    }
    
    public String getMemberName() {
        return memberName;
    }
    
    public void setMemberName(String memberName) {
        this.memberName = memberName;
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
    
    public Date getPaymentDate() {
        return paymentDate;
    }
    
    public void setPaymentDate(Date paymentDate) {
        this.paymentDate = paymentDate;
    }
    
    public Date getDueDate() {
        return dueDate;
    }
    
    public void setDueDate(Date dueDate) {
        this.dueDate = dueDate;
    }
    
    public String getDayRemaining() {
        return dayRemaining;
    }
    
    public void setDayRemaining(String dayRemaining) {
        this.dayRemaining = dayRemaining;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
}

