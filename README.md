# 🎮 Classroom Quest (Multi-Course Portal)

ระบบบันทึกคะแนนการมีส่วนร่วมในชั้นเรียน (ถาม / ตอบ / ช่วยงาน) แบบ Gamification รองรับ 2 รายวิชาใน 1 Repository

---

## 📚 รายวิชาในระบบ
1. 💻 [**การเขียนโปรแกรมภาษาระดับสูง**](./high-level/) (`high-level/`)
2. 🌐 [**การออกแบบและเขียนโปรแกรมบนเว็บ**](./web-programming/) (`web-programming/`)

---

## 📂 โครงสร้างไฟล์ใน Repository
```
S-High-level/
├── index.html            # หน้า Portal หลัก รวมลิงก์เลือกวิชา
├── style.css             # สไตล์ Cozy Game UI กลาง
├── Code.gs               # สคริปต์ Google Apps Script (รองรับแยก Sheet Tab)
├── push_to_github.sh     # สคริปต์ Push ขึ้น GitHub สะดวกในคลิกเดียว
├── high-level/           # วิชา: การเขียนโปรแกรมภาษาระดับสูง
│   ├── index.html
│   ├── app.js
│   └── style.css
└── web-programming/      # วิชา: การออกแบบและเขียนโปรแกรมบนเว็บ
    ├── index.html
    ├── app.js
    └── style.css
```

---

## 📊 วิธีเชื่อมต่อ Google Sheets 1 ไฟล์ คุม 2 วิชา

อาจารย์สามารถใช้ **Google Sheets ไฟล์เดียว** โดยสร้าง 2 แท็บ (แผ่นงาน) ด้านล่าง:
1. **แท็บที่ 1 ตั้งชื่อว่า**: `high_level` (สำหรับวิชา การเขียนโปรแกรมภาษาระดับสูง)
2. **แท็บที่ 2 ตั้งชื่อว่า**: `web_programming` (สำหรับวิชา การออกแบบและเขียนโปรแกรมบนเว็บ)

ทั้งสองแท็บให้มีหัวตารางเหมือนกันในแถวที่ 1:
`student_id` | `full_name` | `nickname` | `photo_url` | `ask_count` | `answer_count` | `help_count` | `total_score`

นำโค้ดใน `Code.gs` ไปใส่ใน Apps Script ➔ Deploy เป็น Web App แล้วนำ URL มาใส่ในระบบเพียงครั้งเดียว ทั้งสองวิชาจะแยกส่งข้อมูลลงแท็บของตัวเองอัตโนมัติครับ!

---

## 🚀 ลิงก์ออนไลน์เมื่อเปิด GitHub Pages
* หน้าเลือกวิชา (Portal): `https://csbongga.github.io/S-High-level/`
* วิชาเขียนโปรแกรมภาษาระดับสูง: `https://csbongga.github.io/S-High-level/high-level/`
* วิชาออกแบบและเขียนโปรแกรมบนเว็บ: `https://csbongga.github.io/S-High-level/web-programming/`
