# TEAM_SPLIT.md

## ข้อมูลกลุ่ม
- กลุ่มที่: 2
- รายวิชา: ENGSE207 Software Architecture

## รายชื่อสมาชิก
- 67543210061-7 นายพิชฌ์ สินธรสวัสดิ์
- ........................................

## การแบ่งงานหลัก

### สมาชิกคนที่ 1: นายพิชฌ์ สินธรสวัสดิ์
รับผิดชอบงานหลักดังต่อไปนี้
- Auth Service: เพิ่ม Register API, logActivity(), logToDB(), แก้ไข DB schema
- Task Service: เพิ่ม logActivity() ใน TASK_CREATED, TASK_STATUS_CHANGED, TASK_DELETED, แก้ไข logs schema
- Activity Service: สร้างใหม่ทั้งหมด ครบทุก endpoint (internal, me, all, health)
- Frontend: เพิ่ม Register tab ใน index.html, สร้าง activity.html, ตั้งค่า config.js
- Docker Compose: ตั้งค่า 3 services + 3 databases
- Deploy ทุก service บน Railway พร้อม environment variables

### สมาชิกคนที่ 2: ........................................
รับผิดชอบงานหลักดังต่อไปนี้
- ........................................

## งานที่ดำเนินการร่วมกัน
- ออกแบบ architecture diagram (Database-per-Service + Railway)
- ทดสอบระบบแบบ end-to-end บน Cloud
- จัดทำ README และ screenshots

## เหตุผลในการแบ่งงาน
แบ่งงานตาม service boundary เพื่อให้แต่ละคนเข้าใจการทำงานภายในของ service ที่รับผิดชอบอย่างลึกซึ้ง และเชื่อมต่อกันผ่าน JWT_SECRET และ ACTIVITY_SERVICE_URL ที่ต้องตั้งค่าให้ตรงกัน

## สรุปการเชื่อมโยงงานของสมาชิก
Auth Service และ Task Service ต้องประสานกับ Activity Service ผ่าน `logActivity()` ที่ส่ง POST ไปยัง `/api/activity/internal` แบบ fire-and-forget JWT_SECRET ต้องใช้ค่าเดียวกันทุก service เพื่อให้ verify token ได้ ACTIVITY_SERVICE_URL ต้องตั้งค่าบน Railway ให้ชี้ไปยัง URL จริงของ activity-service

## Integration Notes
- JWT_SECRET ใช้ร่วมกันทุก service — ต้องตั้งค่าให้เหมือนกันทุก service บน Railway
- ต้อง deploy activity-service ก่อน แล้วค่อยนำ URL ไปตั้งใน ACTIVITY_SERVICE_URL ของ auth-service และ task-service
- fire-and-forget pattern ใน logActivity() ใช้ `.catch(() => {})` เพื่อไม่ให้ service หลักล้มตาม activity-service
