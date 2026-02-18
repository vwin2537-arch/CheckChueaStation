# 🚀 CheckChuea Attendance - Real Database Setup

## 📋 สถานะปัจจุบัน
- ✅ **PostgreSQL Schema** - Prisma models พร้อมใช้งาน
- ✅ **API Endpoints** - CRUD operations สำหรับ Users, Attendance, Stations, Leave Requests
- ✅ **Docker Setup** - PostgreSQL + pgAdmin พร้อมใช้
- ✅ **Database Seeding** - ข้อมูลตัวอย่างสำหรับทดสอบ

---

## 🐳 ขั้นที่ 1: Setup Database (Docker)

### 1.1 เริ่มต้น Docker Containers
```bash
# เริ่ม PostgreSQL + pgAdmin
docker-compose up -d

# ตรวจสอบว่า containers ทำงาน
docker-compose ps
```

### 1.2 เข้าถึง Database
- **PostgreSQL:** `localhost:5432`
  - User: `postgres`
  - Password: `password`
  - Database: `attendance_db`
- **pgAdmin:** `http://localhost:5050`
  - Email: `admin@checkchuea.local`
  - Password: `admin`

---

## 🔧 ขั้นที่ 2: Setup Environment

### 2.1 สร้าง .env.local
```bash
# คัดลอกจาก template
cp .env.example .env.local

# แก้ไขค่า DATABASE_URL (ถ้าจะใช้ค่าอื่น)
DATABASE_URL="postgresql://postgres:password@localhost:5432/attendance_db"
```

### 2.2 ติดตั้ง Dependencies
```bash
npm install
```

---

## 🗄️ ขั้นที่ 3: Database Migration

### 3.1 Generate Prisma Client
```bash
npm run db:generate
```

### 3.2 Push Schema to Database
```bash
npm run db:push
```

### 3.3 Seed Database (ข้อมูลตัวอย่าง)
```bash
npm run db:seed
```

### 3.4 ตรวจสอบ Database (Optional)
```bash
npm run db:studio
# เปิด http://localhost:5555
```

---

## 🧪 ขั้นที่ 4: Test API Endpoints

### 4.1 เริ่ม Development Server
```bash
npm run dev
# เปิด http://localhost:3000
```

### 4.2 Test Database Connection
```bash
curl http://localhost:3000/api/test-db
```

### 4.3 Test API Endpoints
```bash
# Get users
curl http://localhost:3000/api/users

# Get stations
curl http://localhost:3000/api/stations

# Get attendance
curl http://localhost:3000/api/attendance

# Get leave requests
curl http://localhost:3000/api/leave-requests
```

---

## 🔑 ข้อมูลทดสอบ (จาก Seeding)

### Users
- **Admin:** `admin@checkchuea.local` / `admin123`
- **Staff 1:** `staff1@checkchuea.local` / `staff123`
- **Staff 2:** `staff2@checkchuea.local` / `staff123`
- **Staff 3:** `staff3@checkchuea.local` / `staff123`

### Stations
- **สถานีที่ 1** - อาคารหลัก (ชั้น 1 ด้านหน้า)
- **สถานีที่ 2** - โรงจอดรถ (ชั้น B1)

### Data
- **Attendance Records:** 30 วันย้อนหลัง
- **Leave Requests:** 3 คำขอ (pending, approved)
- **Audit Logs:** 2 logs (create station, approve leave)

---

## 📡 API Endpoints Documentation

### Users
- `GET /api/users` - ดึงรายชื่อผู้ใช้
- `POST /api/users` - สร้างผู้ใช้ใหม่
- `GET /api/users/[id]` - ดึงข้อมูลผู้ใช้
- `PUT /api/users/[id]` - แก้ไขข้อมูลผู้ใช้
- `DELETE /api/users/[id]` - ปิดใช้งานผู้ใช้

### Attendance
- `GET /api/attendance` - ดึงข้อมูลเช็คชื่อ
- `POST /api/attendance` - เช็คอิน
- `POST /api/attendance/[id]/checkout` - เช็คเอาท์

### Stations
- `GET /api/stations` - ดึงรายชื่อสถานี
- `POST /api/stations` - สร้างสถานีใหม่

### Leave Requests
- `GET /api/leave-requests` - ดึงคำขอลา
- `POST /api/leave-requests` - สร้างคำขอลา
- `POST /api/leave-requests/[id]/approve` - อนุมัติ/ปฏิเสธคำขอลา

---

## 🎯 ถัดไป: Authentication

เมื่อ Database พร้อมแล้ว ขั้นตอนถัดไปคือ:

1. **LINE Login Integration**
2. **JWT Token Management**
3. **Session Handling**
4. **Role-based Access Control**

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# ตรวจสอสถานะ PostgreSQL
docker-compose logs postgres

# Restart containers
docker-compose restart
```

### Prisma Issues
```bash
# Reset database
npm run db:reset

# Regenerate client
npm run db:generate
```

### Port Conflicts
```bash
# ตรวจสอดู port ที่ใช้
netstat -an | grep :5432
netstat -an | grep :3000
```

---

## ✅ ตรวจสอบว่าทำงาน

1. **Database:** `docker-compose ps` ต้องแสดง containers ทำงาน
2. **API:** `curl http://localhost:3000/api/test-db` ต้อง return success
3. **Frontend:** `http://localhost:3000` ต้องเปิดได้
4. **Data:** pgAdmin ต้องเห็นข้อมูลจาก seeding

**🎉 พร้อมใช้งานจริงแล้ว!**
