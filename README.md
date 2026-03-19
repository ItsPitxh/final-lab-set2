# ENGSE207 Software Architecture
## README — Final Lab Set 2: Microservices + Activity Tracking + Cloud (Railway)

> เอกสารฉบับนี้ใช้เป็น `README.md` สำหรับ repository ของ **Final Lab Set 2**

---

## 1. ข้อมูลรายวิชาและสมาชิก

**รายวิชา:** ENGSE207 Software Architecture
**ชื่องาน:** Final Lab — ชุดที่ 2: Microservices + Activity Tracking + Cloud (Railway)

**สมาชิกในกลุ่ม**
- นายพิชฌ์ สินธรสวัสดิ์ / 67543210061-7
- ........................................

**กลุ่มที่:** 2

**Repository:** `final-lab-set2/`

---

## 2. ภาพรวมของระบบ

Final Lab ชุดที่ 2 ต่อยอดจาก Set 1 โดยเพิ่มระบบ Activity Tracking และ Deploy ขึ้น Railway Cloud โดยเน้นหัวข้อสำคัญดังนี้

- เพิ่ม Register API ใน Auth Service
- สร้าง Activity Service สำหรับบันทึก user events ทุกอย่างในระบบ
- ออกแบบ service-to-service call แบบ fire-and-forget
- ใช้ Database-per-Service pattern (auth-db, task-db, activity-db แยกกัน)
- Deploy ทุก service บน Railway Cloud พร้อม HTTPS อัตโนมัติ

---

## 3. วัตถุประสงค์ของงาน

งานนี้มีจุดมุ่งหมายเพื่อฝึกให้นักศึกษาสามารถ

- ออกแบบ Database-per-Service Pattern ได้
- ขยายระบบโดยเพิ่ม Register API และ Activity Service
- ออกแบบ service-to-service call แบบ fire-and-forget
- อธิบาย Denormalization และเหตุผลที่ใช้ใน Microservices
- Deploy 3 services และ 3 databases บน Railway ได้

---

## 4. Architecture Overview

```text
Browser / Postman
        │
        │ HTTPS (Railway จัดการให้อัตโนมัติ)
        ▼
┌───────────────────────────────────────────────────────┐
│                   Railway Project                     │
│                                                       │
│  Auth Service        Task Service     Activity Svc    │
│  auth-xxx.railway    task-xxx.railway activity-xxx…   │
│       │                   │                  ▲        │
│       └───────────────────┴──────────────────┘        │
│       │  POST /api/activity/internal (fire-and-forget)│
│       ▼                   ▼                  ▼        │
│   auth-db             task-db          activity-db    │
│  [PostgreSQL]        [PostgreSQL]      [PostgreSQL]   │
└───────────────────────────────────────────────────────┘

Frontend เรียกแต่ละ service โดยตรงผ่าน config.js
```

### Services ที่ใช้ในระบบ
- **auth-service** — Register, Login, Verify, Me
- **task-service** — CRUD Tasks พร้อม JWT guard
- **activity-service** — รับ events จาก services อื่น, ดู activity timeline
- **auth-db / task-db / activity-db** — PostgreSQL แยกกันต่อ service
- **frontend** — Task Board (index.html) + Activity Timeline (activity.html)

---

## 5. Cloud URLs (Railway)

| Service | URL |
|---|---|
| auth-service | `https://auth-service-production-2dcf.up.railway.app` |
| task-service | `https://task-service-production-0c06.up.railway.app` |
| activity-service | `https://hearty-analysis-production.up.railway.app` |

---

## 6. โครงสร้าง Repository

```text
final-lab-set2/
├── README.md
├── TEAM_SPLIT.md
├── INDIVIDUAL_REPORT_67543210061-7.md
├── docker-compose.yml
├── .env.example
├── auth-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── init.sql
│   └── src/
├── task-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── init.sql
│   └── src/
├── activity-service/
│   ├── Dockerfile
│   ├── package.json
│   ├── init.sql
│   └── src/
├── frontend/
│   ├── index.html
│   ├── activity.html
│   ├── config.js
│   └── Dockerfile
└── screenshots/
```

---

## 6. เทคโนโลยีที่ใช้

- Node.js / Express.js
- PostgreSQL (Database-per-Service)
- Docker / Docker Compose
- HTML / CSS / JavaScript
- JWT
- bcryptjs
- Railway (Cloud Deployment)

---

## 7. การตั้งค่าและการรันระบบ (Local)

### 7.1 สร้างไฟล์ `.env`

```env
JWT_SECRET=engse207-sec2-shared-secret-change-this
```

### 7.2 รันระบบ Local

```bash
docker compose up --build
```

### 7.3 ทดสอบ Local

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@sec2.local","password":"123456"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@sec2.local","password":"123456"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# ตรวจสอบ Activity
curl http://localhost:3003/api/activity/me \
  -H "Authorization: Bearer $TOKEN"
```

---

## 8. Seed Users สำหรับทดสอบ

| Username | Email | Password | Role |
|---|---|---|---|
| alice | alice@lab.local | alice123 | member |
| admin | admin@lab.local | adminpass | admin |

---

## 9. API Summary

### Auth Service
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/verify`
- `GET /api/auth/me`
- `GET /api/auth/health`

### Task Service
- `GET /api/tasks/health`
- `GET /api/tasks/`
- `POST /api/tasks/`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Activity Service
- `POST /api/activity/internal` (internal only — no JWT)
- `GET /api/activity/me` (JWT required)
- `GET /api/activity/all` (admin only)
- `GET /api/activity/health`

---

## 10. การทดสอบระบบบน Cloud

```bash
AUTH_URL="https://auth-service-production-2dcf.up.railway.app"
TASK_URL="https://task-service-production-0c06.up.railway.app"
ACTIVITY_URL="https://hearty-analysis-production.up.railway.app"

# T2: Register
curl -X POST $AUTH_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"sec2user","email":"sec2@test.com","password":"123456"}'

# T3: Login + save token
TOKEN=$(curl -s -X POST $AUTH_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sec2@test.com","password":"123456"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# T4: Auth Me
curl $AUTH_URL/api/auth/me -H "Authorization: Bearer $TOKEN"

# T5: ตรวจ USER_REGISTERED + USER_LOGIN
curl $ACTIVITY_URL/api/activity/me -H "Authorization: Bearer $TOKEN"

# T6: Create Task แล้วตรวจ TASK_CREATED
curl -X POST $TASK_URL/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Cloud activity test","priority":"high"}'
curl $ACTIVITY_URL/api/activity/me -H "Authorization: Bearer $TOKEN"

# T7: Update Task status แล้วตรวจ TASK_STATUS_CHANGED
curl -X PUT $TASK_URL/api/tasks/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"DONE"}'
curl "$ACTIVITY_URL/api/activity/me?event_type=TASK_STATUS_CHANGED" \
  -H "Authorization: Bearer $TOKEN"

# T8: Get Tasks
curl $TASK_URL/api/tasks -H "Authorization: Bearer $TOKEN"

# T9: ไม่มี JWT → 401
curl $TASK_URL/api/tasks
curl $ACTIVITY_URL/api/activity/me

# T10: member → 403, admin → 200
ADMIN_TOKEN=$(curl -s -X POST $AUTH_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lab.local","password":"adminpass"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")
curl $ACTIVITY_URL/api/activity/all -H "Authorization: Bearer $TOKEN"        # 403
curl $ACTIVITY_URL/api/activity/all -H "Authorization: Bearer $ADMIN_TOKEN"  # 200
```

---

## 11. Screenshots ที่แนบในงาน

โฟลเดอร์ `screenshots/` ของกลุ่มนี้ประกอบด้วยภาพดังต่อไปนี้

- `01_railway_dashboard.png`
- `02_auth_register_cloud.png`
- `03_auth_login_cloud.png`
- `04_auth_me_cloud.png`
- `05_activity_me_user_events.png`
- `06_activity_task_created.png`
- `07_activity_status_changed.png`
- `08_task_list_cloud.png`
- `09_protected_401.png`
- `10_member_activity_all_403.png`
- `11_admin_activity_all_200.png`
- `12_readme_architecture.png`

---

## 12. การแบ่งงานของทีม

รายละเอียดการแบ่งงานของสมาชิกอยู่ในไฟล์:

- `TEAM_SPLIT.md`

และรายงานรายบุคคลของสมาชิกแต่ละคนอยู่ในไฟล์:

- `INDIVIDUAL_REPORT_67543210061-7.md`

---

## 13. ปัญหาที่พบและแนวทางแก้ไข

- ปัญหา Activity แสดง 0 events เพราะ `ACTIVITY_SERVICE_URL` ไม่ได้ตั้งค่าบน Railway → แก้ไขโดยเพิ่ม env var ใน Railway dashboard
- ปัญหา schema ไม่ตรงกันระหว่าง `CREATE TABLE` ใน index.js กับ column ที่ใช้จริง → แก้ไข schema ให้ตรงกัน
- ปัญหา Railway frontend healthcheck ล้มเหลวเพราะ railway.json มี startCommand override → แก้ไขโดยลบ railway.json ออก

---

## 14. ข้อจำกัดของระบบ

- `/api/activity/internal` ไม่มี JWT protection เหมาะสำหรับ Lab เท่านั้น
- Database-per-Service ทำให้ไม่สามารถ JOIN ข้าม DB ได้ ต้องใช้ Denormalization
- fire-and-forget หมายความว่า Activity อาจสูญหายได้ถ้า activity-service ล่ม

---

## 15. อธิบาย Patterns สำคัญ

### Database-per-Service
แต่ละ service มี database เป็นของตัวเอง auth-service ไม่สามารถเข้าถึง task-db ได้โดยตรง ทำให้ต้อง denormalize ข้อมูล เช่น เก็บ `username` ไว้ใน `activities` table เพื่อแสดงผลได้โดยไม่ต้อง JOIN ข้าม database

### Fire-and-Forget
`logActivity()` ส่ง HTTP request ไปยัง activity-service โดยใช้ `.catch(() => {})` ต่อท้าย หมายความว่าถ้า activity-service ไม่ตอบ auth-service และ task-service ยังทำงานได้ปกติ เพียงแต่ activity จะไม่ถูกบันทึกชั่วคราว

### Gateway Strategy
Frontend เรียก URL ของแต่ละ service โดยตรงผ่าน `config.js` (Option A: Direct Call) ไม่มี API Gateway กลาง เหมาะสำหรับระบบขนาดเล็กในสภาพแวดล้อม Lab

---

## 16. ภาคผนวก

### ไฟล์สำคัญใน repository
- `docker-compose.yml`
- `auth-service/src/routes/auth.js`
- `task-service/src/routes/tasks.js`
- `activity-service/src/index.js`
- `frontend/index.html`
- `frontend/activity.html`
- `frontend/config.js`

---

> เอกสารฉบับนี้เป็น README สำหรับงาน Final Lab Set 2 ของกลุ่ม และจัดทำเพื่อประกอบการส่งงานในรายวิชา ENGSE207 Software Architecture
