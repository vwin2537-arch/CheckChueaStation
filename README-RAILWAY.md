# 🚀 Railway Deploy Guide

## 📋 สิ่งที่ต้องเตรียม

### 1. Railway Account
- Sign up: https://railway.app/
- Verify email
- Add payment method (หลัง trial)

### 2. GitHub Repository
- ✅ พร้อมแล้ว: `https://github.com/vwin2537-arch/CheckChueaStation.git`

---

## 🚀 ขั้นตอนการ Deploy

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Login และ Setup
```bash
# Login
railway login

# สร้าง project ใหม่
railway new

# Link GitHub repo
railway link
```

### Step 3: เพิ่ม PostgreSQL Database
```bash
# เพิ่ม PostgreSQL service
railway add postgresql

# ดู connection string
railway variables get DATABASE_URL
```

### Step 4: Set Environment Variables
```bash
# Database config
railway variables set USE_REAL_DATABASE=true

# Next.js config
railway variables set NEXTAUTH_URL=https://your-app-name.railway.app
railway variables set NEXTAUTH_SECRET=your-secret-key-here

# LINE Login (ถ้ามี)
railway variables set LINE_CHANNEL_ID=your-line-channel-id
railway variables set LINE_CHANNEL_SECRET=your-line-channel-secret
railway variables set LINE_CALLBACK_URL=https://your-app-name.railway.app/api/auth/line/callback

# ดูตัวแปรทั้งหมด
railway variables list
```

### Step 5: Deploy
```bash
# Deploy ครั้งแรก
railway up

# ดู logs
railway logs

# เปิด app ใน browser
railway open
```

---

## 🗄️ Database Migration

### หลัง Deploy สำเร็จ:
```bash
# 1. เข้าถึง Railway shell
railway shell

# 2. Generate Prisma client
npm run db:generate

# 3. Push schema
npm run db:push

# 4. Seed database
npm run db:seed
```

---

## 🔧 การตั้งค่า LINE Login

### 1. สร้าง LINE Login Channel:
- เข้า https://developers.line.biz/
- สร้าง Channel ใหม่
- เลือก "LINE Login"

### 2. ตั้งค่า Callback URL:
```
https://your-app-name.railway.app/api/auth/line/callback
```

### 3. รับ Credentials:
- **Channel ID**
- **Channel Secret**

### 4. อัปเดต Environment:
```bash
railway variables set LINE_CHANNEL_ID=your-channel-id
railway variables set LINE_CHANNEL_SECRET=your-channel-secret
```

---

## 📱 การใช้งาน

### URL หลัง Deploy:
- **App:** `https://your-app-name.railway.app`
- **API:** `https://your-app-name.railway.app/api/*`
- **Health Check:** `https://your-app-name.railway.app/api/health`

### การทดสอบ:
```bash
# Test API
curl https://your-app-name.railway.app/api/health

# Test data source
curl https://your-app-name.railway.app/api/data-source
```

---

## 🎯 Features ที่พร้อมใช้

### ✅ พร้อมใช้งาน:
- **PostgreSQL Database** - Railway managed
- **API Endpoints** - CRUD operations
- **Real-time Dashboard** - Live updates
- **Analytics** - Charts & reports
- **Export** - Excel/PDF/CSV
- **Data Source Switch** - Mock ↔ Real

### 🔧 ที่ต้องเพิ่ม:
- **LINE Login** - Authentication
- **QR Code** - Check-in stations
- **Email Notifications** - Leave requests

---

## 💰 ต้นทุน

### Free Trial:
- **$0** - 7 วันแรก
- **Database:** 1GB
- **Bandwidth:** 100GB

### Production:
- **$5/month** - หลัง trial
- **Database:** 1GB
- **Bandwidth:** 100GB
- **Builds:** 500/month

### สำหรับองค์กร (50-100 คน):
- **$20-50/month** - พอสำหรับใช้งานจริง

---

## 🔍 Troubleshooting

### Database Connection Issues:
```bash
# Check DATABASE_URL
railway variables get DATABASE_URL

# Test connection
railway shell
npm run db:studio
```

### Build Errors:
```bash
# Check logs
railway logs

# Redeploy
railway up
```

### Environment Issues:
```bash
# List all variables
railway variables list

# Update variable
railway variables set VARIABLE_NAME=value
```

---

## 🎉 หลัง Deploy สำเร็จ

1. **Test App:** เปิด `railway open`
2. **Test API:** `/api/health` และ `/api/data-source`
3. **Setup LINE:** เพิ่ม LINE Login
4. **Test Users:** สร้างผู้ใช้จริง
5. **Go Live:** แชร์ให้เจ้าหน้าที่ใช้

**🚀 พร้อมใช้งานจริงแล้ว!**
