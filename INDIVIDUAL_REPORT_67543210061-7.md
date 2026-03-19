# INDIVIDUAL_REPORT_67543210061-7.md

## ข้อมูลผู้จัดทำ
- ชื่อ-นามสกุล: นายพิชฌ์ สินธรสวัสดิ์
- รหัสนักศึกษา: 67543210061-7
- กลุ่ม: 2

## ขอบเขตงานที่รับผิดชอบ
รับผิดชอบงานทั้งหมดในกลุ่ม ได้แก่ Auth Service (Register + logActivity), Task Service (logActivity ทุก CRUD), Activity Service (สร้างใหม่ทั้งหมด), Frontend (index.html + activity.html + config.js), Docker Compose, และการ Deploy ทุก service บน Railway

## สิ่งที่ได้ดำเนินการด้วยตนเอง
- เพิ่ม Register API ใน auth-service พร้อม logActivity() และ logToDB()
- แก้ไข schema ของ auth-service และ task-service ให้ตรงกับ column ที่ใช้จริง
- เพิ่ม logActivity() ใน task-service ทุก route ได้แก่ TASK_CREATED, TASK_STATUS_CHANGED, TASK_DELETED
- สร้าง activity-service ใหม่ทั้งหมด ครบทุก endpoint: /internal, /me, /all, /health
- พัฒนา frontend เพิ่ม Register tab ใน index.html และสร้าง activity.html ใหม่
- ตั้งค่า config.js ให้ใช้ Railway URL จริง
- Deploy auth-service, task-service, activity-service บน Railway พร้อม PostgreSQL plugin แยกกัน 3 ก้อน
- แก้ไขปัญหา Railway frontend healthcheck failure โดยลบ railway.json ออก

## ปัญหาที่พบและวิธีการแก้ไข

**ปัญหาที่ 1: Activity แสดง 0 events บน Railway**
เนื่องจาก `ACTIVITY_SERVICE_URL` ใน auth-service และ task-service ไม่ได้ตั้งค่าบน Railway ทำให้ `logActivity()` ส่ง request ไปที่ Docker hostname `http://activity-service:3003` ซึ่งไม่มีอยู่บน Cloud แก้ไขโดยเพิ่ม environment variable `ACTIVITY_SERVICE_URL=https://hearty-analysis-production.up.railway.app` ใน Railway dashboard ของทั้งสอง service

**ปัญหาที่ 2: Railway frontend healthcheck ล้มเหลวซ้ำหลายครั้ง**
สาเหตุคือ railway.json มี `startCommand: "nginx -g 'daemon off;'"` ที่ override Dockerfile CMD ทำให้ script ที่เตรียม nginx.conf ไม่ทำงาน และ nginx ไม่มี server block ให้ฟัง แก้ไขโดยลบ railway.json ออกทั้งหมด ให้ Railway ใช้ default process healthcheck แทน

## สิ่งที่ได้เรียนรู้จากงานนี้
- เข้าใจ Database-per-Service Pattern และ trade-off ที่ต้องใช้ Denormalization เก็บ username ไว้ใน activities table
- เข้าใจ fire-and-forget pattern และทำไมถึงต้องใช้ `.catch(() => {})` เพื่อไม่ให้ service หลักล้มตาม activity-service
- เข้าใจการ Deploy microservices บน Railway และการตั้งค่า environment variable ระหว่าง services
- เข้าใจลำดับการ deploy ว่าต้อง deploy activity-service ก่อนแล้วค่อยกลับมาตั้ง ACTIVITY_SERVICE_URL ใน auth และ task service
- เข้าใจว่า railway.json startCommand override Dockerfile CMD และผลกระทบที่เกิดขึ้น

## อธิบาย: Denormalization ใน activities table คืออะไร และทำไมต้องทำ
ใน Database-per-Service pattern activity-db ไม่มี users table เพราะ users อยู่ใน auth-db ถ้าต้องการแสดง username ใน activity timeline จะต้อง query ข้าม 2 databases ซึ่งทำไม่ได้โดยตรง จึงแก้ปัญหาโดยเก็บ `username` ไว้ใน activities table ณ เวลาที่ event เกิดขึ้นเลย เรียกว่า Denormalization ข้อเสียคือถ้า user เปลี่ยน username ในภายหลัง ข้อมูลใน activities จะไม่อัปเดตตาม แต่สำหรับ event log ถือว่ายอมรับได้

## อธิบาย: ทำไม logActivity() ต้องเป็น fire-and-forget
เพราะ activity tracking เป็น non-critical feature ถ้า logActivity() รอผลลัพธ์จาก activity-service และ activity-service ล่มหรือช้า จะทำให้ auth-service และ task-service ตอบช้าหรือ error ตามไปด้วย ซึ่งกระทบกับการใช้งานหลัก การใช้ `.catch(() => {})` ทำให้ service หลักทำงานต่อได้ทันทีโดยไม่สนใจผลลัพธ์ของ activity log

## แนวทางการพัฒนาต่อไป
- เพิ่ม authentication บน `/api/activity/internal` เพื่อความปลอดภัยใน production
- ใช้ message queue เช่น Redis หรือ RabbitMQ แทน HTTP fire-and-forget เพื่อไม่ให้ events สูญหายเมื่อ activity-service ล่ม
- เพิ่ม pagination ใน activity timeline
