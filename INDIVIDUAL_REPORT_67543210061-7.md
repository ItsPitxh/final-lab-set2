# INDIVIDUAL_REPORT_67543210061-7.md

## ข้อมูลผู้จัดทำ
- ชื่อ-นามสกุล: นายพิชฌ์ สินธรสวัสดิ์
- รหัสนักศึกษา: 67543210061-7
- กลุ่ม: 2

## ขอบเขตงานที่รับผิดชอบ
รับผิดชอบงานทั้งหมดในกลุ่ม ได้แก่ Auth Service, Task Service, Log Service, Frontend, Nginx, Docker Compose และการทดสอบระบบ

## สิ่งที่ได้ดำเนินการด้วยตนเอง
- เขียน auth-service ครบทุก route ได้แก่ login, verify, me, health พร้อม JWT middleware
- เขียน task-service ครบทุก CRUD route พร้อม JWT guard และ role-based access
- เขียน log-service สำหรับรับ internal log events จาก auth และ task service
- ตั้งค่า Nginx เป็น reverse proxy พร้อม TLS termination และ rate limiting
- พัฒนา frontend หน้า Task Board และ Log Dashboard
- เขียน Docker Compose รวมทุก service และ PostgreSQL ให้ทำงานร่วมกัน
- สร้าง Self-Signed Certificate ผ่าน script gen-certs.sh
- เขียน db/init.sql สำหรับ schema และ seed users

## ปัญหาที่พบและวิธีการแก้ไข

**ปัญหาที่ 1: Seed users login ไม่ได้**
เนื่องจาก bcrypt hash ที่ใส่ไว้ใน init.sql ไม่ถูกต้อง ต้อง generate ใหม่ด้วย Node.js แล้วแทนค่าให้ถูกต้องก่อนรัน docker compose

**ปัญหาที่ 2: JWT_SECRET ไม่ตรงกันระหว่าง services**
auth-service เซ็น token ด้วย secret ค่าหนึ่ง แต่ task-service ใช้ค่า default ที่ต่างออกไป แก้ไขโดยกำหนด JWT_SECRET ร่วมกันผ่าน .env และ docker-compose.yml

## สิ่งที่ได้เรียนรู้จากงานนี้
- เข้าใจหลักการ service separation และการกำหนด boundary ของแต่ละ service
- เข้าใจ JWT flow ตั้งแต่การออก token ไปจนถึงการ verify ในแต่ละ service
- เข้าใจการทำ TLS termination ที่ Nginx และการเชื่อมต่อ internal network ด้วย HTTP
- เข้าใจ trade-off ของ shared database ในระบบ Microservices เบื้องต้น
- เข้าใจการใช้ Docker Compose จัดการ multi-container application

## แนวทางการพัฒนาต่อไปใน Set 2
- แยก database เป็น database-per-service (auth-db, task-db, activity-db)
- เพิ่ม Register API ใน auth-service
- สร้าง Activity Service ใหม่สำหรับบันทึก user events แทน Log Service
- ออกแบบ service-to-service call แบบ fire-and-forget ระหว่าง services
- Deploy ทุก service ขึ้น Railway Cloud พร้อม environment variables ที่ถูกต้อง
