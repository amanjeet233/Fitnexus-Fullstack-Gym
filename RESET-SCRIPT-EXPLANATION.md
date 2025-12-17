# 📋 RESET-MEMBERS-AND-PAYMENTS.sql - Step by Step Explanation

## यह Script क्या करता है?

यह script **सभी members और payments को delete** करता है और database को clean करता है।

---

## Step-by-Step Process:

### **Step 1: Database Select करना**
```sql
USE gms;
```
- `gms` database select करता है

### **Step 2: Foreign Key Checks Disable करना**
```sql
SET FOREIGN_KEY_CHECKS = 0;
```
- Foreign key constraints temporarily disable करता है
- ताकि delete operations smoothly चलें

### **Step 3: Related Data Delete करना**

#### 3.1 Payments Delete
```sql
DELETE FROM payment;
```
- सभी payment records delete करता है

#### 3.2 Attendance Delete
```sql
DELETE FROM attendance;
```
- सभी attendance records delete करता है

#### 3.3 Workout Plans Delete
```sql
DELETE FROM workout_plan;
```
- सभी workout plans delete करता है

#### 3.4 Progress Entries Delete
```sql
DELETE FROM progress_entry;
```
- सभी progress tracking records delete करता है

#### 3.5 Feedback Delete (Member-related)
```sql
DELETE FROM feedback WHERE to_member_id IS NOT NULL;
```
- सिर्फ member-related feedback delete करता है
- Trainer feedback safe रहता है

#### 3.6 User Accounts Delete (Member-linked)
```sql
DELETE FROM user WHERE member_id IS NOT NULL;
```
- Member role वाले user accounts delete करता है
- Admin और Trainer accounts safe रहते हैं

### **Step 4: Members Delete करना**
```sql
DELETE FROM member;
```
- सभी members delete करता है

### **Step 5: AUTO_INCREMENT Reset करना**
```sql
ALTER TABLE payment AUTO_INCREMENT = 1;
ALTER TABLE attendance AUTO_INCREMENT = 1;
ALTER TABLE workout_plan AUTO_INCREMENT = 1;
ALTER TABLE progress_entry AUTO_INCREMENT = 1;
ALTER TABLE feedback AUTO_INCREMENT = 1;
```
- ID counters reset करता है
- नए records 1 से start होंगे

### **Step 6: Foreign Key Checks Enable करना**
```sql
SET FOREIGN_KEY_CHECKS = 1;
```
- Foreign key constraints फिर से enable करता है

### **Step 7: Confirmation Show करना**
```sql
SELECT 'All members and payments have been reset successfully!' AS Status;
SELECT COUNT(*) AS Remaining_Members FROM member;
SELECT COUNT(*) AS Remaining_Payments FROM payment;
```
- Success message और count show करता है

---

## ⚠️ **क्या Delete होगा:**

✅ **Delete होगा:**
- सभी Members
- सभी Payments
- सभी Attendance records
- सभी Workout plans
- सभी Progress entries
- Member-related Feedback
- Member user accounts

❌ **Safe रहेगा:**
- Admin user (admin/admin)
- Trainers
- Plans (Basic, Plus, Premium)
- Trainer-related Feedback

---

## 🚀 **कैसे Use करें:**

### **Option 1: Batch Script (Recommended)**
```bash
reset-members-payments.bat
```
- Confirmation मांगेगा
- Automatically run करेगा

### **Option 2: Direct MySQL**
```bash
mysql -u root -p"Amanjeet@4321." gms < RESET-MEMBERS-AND-PAYMENTS.sql
```

---

## ⚠️ **Warning:**

- **यह permanent delete है** - data recover नहीं होगा
- **Backup लें** पहले (अगर जरूरी हो)
- **Admin account safe है** - login कर सकेंगे

---

## ✅ **After Reset:**

1. Database clean होगा
2. नए members add कर सकते हैं
3. Fresh start होगा
4. ID counters reset होंगे

---

**यह script database को clean करके fresh start देता है!**

