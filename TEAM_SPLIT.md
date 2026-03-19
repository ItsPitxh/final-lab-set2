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
- Auth Service: login, verify, me, health routes พร้อม JWT middleware
- Task Service: CRUD routes ทั้งหมด พร้อม role-based access control
- Log Service: รับ internal log events จาก auth และ task service
- Nginx: reverse proxy configuration, TLS termination, rate limiting
- Frontend: Task Board (index.html) และ Log Dashboard (logs.html)
- Docker Compose: ตั้งค่า multi-container environment ครบทุก service
- db/init.sql: schema และ seed users
- scripts/gen-certs.sh: Self-Signed Certificate

### สมาชิกคนที่ 2: ........................................
รับผิดชอบงานหลักดังต่อไปนี้
- ........................................

## งานที่ดำเนินการร่วมกัน
- ออกแบบ architecture diagram
- ทดสอบระบบแบบ end-to-end
- จัดทำ README และ screenshots

## เหตุผลในการแบ่งงาน
แบ่งงานตาม service boundary และความรับผิดชอบด้าน integration เพื่อให้แต่ละคนเข้าใจการทำงานของ service ที่ตนรับผิดชอบอย่างลึกซึ้ง

## สรุปการเชื่อมโยงงานของสมาชิก
งานของสมาชิกทุกคนเชื่อมต่อกันผ่าน JWT_SECRET ที่ใช้ร่วมกัน และ Docker network ภายในที่ให้ services สื่อสารกันได้ โดยต้องประสานกันในส่วนของ API contract ระหว่าง services และการตั้งค่า environment variables ให้ตรงกัน
