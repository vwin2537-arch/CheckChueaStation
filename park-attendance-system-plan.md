# 📋 แผนงานสร้างระบบเช็คชื่อเจ้าหน้าที่อุทยานแห่งชาติ
# Park Staff Attendance System - AI Development Plan

---

## 🎯 ภาพรวมโปรเจกต์ (Project Overview)

**ชื่อระบบ:** ระบบเช็คชื่อเจ้าหน้าที่อุทยานฯ ด้วย QR Code
**ผู้ใช้:** เจ้าหน้าที่สถานีดับไฟป่า อุทยานแห่งชาติ (~25 คน)
**เป้าหมาย:** เว็บแอปสำหรับเช็คชื่อเข้า-ออกงานด้วยการสแกน QR Code ตามจุดปฏิบัติงาน พร้อมระบบป้องกันการทุจริต แจ้งลา และรายงานสรุปอัตโนมัติ
**Tech Stack:** PHP + MySQL + HTML/CSS/JS + LINE Login API + LINE Messaging API + Google Drive API
**Hosting:** Shared Hosting หรือ VPS ทั่วไป (รองรับ PHP + MySQL)
**Storage:** รูปภาพทั้งหมด (เซลฟี่ + เอกสารลา) เก็บใน Google Drive → SQL เก็บเฉพาะ link

---

## 👥 ประเภทผู้ใช้ (User Roles)

| Role | สิทธิ์ | คำอธิบาย |
|------|--------|----------|
| **admin** | เต็ม | หัวหน้าสถานี - จัดการทุกอย่าง อนุมัติลา ดูรายงาน ตั้งค่าระบบ |
| **staff** | จำกัด | เจ้าหน้าที่ทั่วไป - สแกนเช็คชื่อ แจ้งลา ดูข้อมูลตัวเอง |

---

## 🔐 ระบบ Login & ลงทะเบียน (Authentication)

### วิธีการ: ใช้ LINE Login

**เหตุผล:** เจ้าหน้าที่ทุกคนใช้ LINE อยู่แล้ว ไม่ต้องจำ username/password เพิ่ม

### ขั้นตอนลงทะเบียน (ทำครั้งเดียว):
1. เจ้าหน้าที่เปิด web app
2. กดปุ่ม "ลงทะเบียนด้วย LINE"
3. ระบบ redirect ไป LINE Login → ได้ LINE User ID กลับมา
4. เจ้าหน้าที่กรอกข้อมูลเพิ่ม: ชื่อ-สกุล, ตำแหน่ง, เบอร์โทร
5. ระบบบันทึก **Device Fingerprint** ของมือถือเครื่องนั้นไว้ (ใช้ FingerprintJS library)
6. สถานะเริ่มต้น = `pending` → รอ admin กดอนุมัติ
7. admin กดอนุมัติ → สถานะเปลี่ยนเป็น `active` → ใช้งานได้

### ขั้นตอน Login ปกติ:
1. เปิด web app → กด "เข้าสู่ระบบด้วย LINE"
2. ระบบเช็ค LINE User ID → หาในฐานข้อมูล
3. ถ้าพบ + status = active → เข้าสู่ระบบสำเร็จ
4. เก็บ session ไว้ (PHP session + cookie)

---

## 📍 ระบบจุดสแกน QR Code (Scan Stations)

### แนวคิด:
- ปริ้น QR Code ลงกระดาษ → เคลือบกันน้ำ → ติดตามจุดปฏิบัติงาน
- QR แต่ละจุดเก็บ URL ที่มี station_id + secret_key
- แนะนำเปลี่ยน QR ใหม่ทุก 3-6 เดือน หรือเมื่อสงสัยว่ารั่วไหล

### รูปแบบ QR:
```
https://[domain]/scan.php?station={station_id}&key={secret_key}
```

### ตัวอย่าง:
```
https://app.example.com/scan.php?station=1&key=a3f9b2x7k
https://app.example.com/scan.php?station=2&key=m8n4p1q5z
```

### Admin สามารถ:
- เพิ่ม/ลบ/แก้ไขจุดสแกน
- กำหนดชื่อจุด, พิกัด GPS (ละติจูด/ลองจิจูด), รัศมีที่ยอมรับ (เมตร)
- Generate QR Code ใหม่ (เปลี่ยน secret_key)
- ปริ้น QR ออกจากระบบได้เลย

---

## ✅ ระบบเช็คชื่อ (Attendance Check-in/out)

### ขั้นตอนเช็คชื่อ:

```
เจ้าหน้าที่เปิด Web App (login แล้ว)
    │
    ▼
กดปุ่ม "เช็คชื่อเข้างาน" หรือ "เช็คชื่อออกงาน"
    │
    ▼
กล้องมือถือเปิดขึ้น → สแกน QR Code ที่ติดประจำจุด
    │
    ▼
ระบบตรวจสอบ 4 ชั้น:
    │
    ├── 1. QR ถูกต้อง? (station_id + secret_key ตรง)
    ├── 2. GPS อยู่ในรัศมี? (เทียบพิกัดมือถือ กับ พิกัดจุดสแกน)
    ├── 3. Device ตรง? (fingerprint ตรงกับที่ลงทะเบียน)
    └── 4. ถ่ายเซลฟี่ (บังคับถ่ายรูปหน้าตัวเอง)
    │
    ▼
ถ้าผ่านทุกข้อ → บันทึกสำเร็จ
ถ้าไม่ผ่านข้อใดข้อหนึ่ง → แจ้งเตือน + บันทึกแบบ flag suspicious
    │
    ▼
ส่ง LINE แจ้งเตือน admin (ถ้าสาย หรือ ผิดปกติ)
```

### การคำนวณสถานะ:

| เงื่อนไข | สถานะ |
|----------|--------|
| เช็คชื่อภายในเวลาที่กำหนด | ✅ `on_time` ตรงเวลา |
| เช็คชื่อหลังเวลา 1-15 นาที | ⚠️ `late` สาย |
| เช็คชื่อหลังเวลา 16-60 นาที | 🔴 `very_late` สายมาก |
| ไม่เช็คชื่อเลยทั้งวัน (ไม่ได้ลา) | ❌ `absent` ขาด |
| มีใบลาอนุมัติแล้ว | 📝 `leave` ลา |

> **หมายเหตุ:** ค่านาทีต่างๆ (15, 60) admin สามารถตั้งค่าได้ในหน้าตั้งค่าระบบ

---

## 🛡️ ระบบป้องกันทุจริต (Anti-Fraud System)

### 4 ชั้นป้องกัน:

### ชั้น 1: GPS Verification
- เมื่อสแกน QR ระบบจะดึง GPS จากมือถือ
- คำนวณระยะห่างระหว่าง GPS มือถือ กับ พิกัดจุดสแกน (Haversine Formula)
- ถ้าห่างเกินรัศมีที่กำหนด (เช่น 150 เมตร) → flag `gps_mismatch`
- ตรวจจับ Mock Location (Fake GPS): ใช้ JavaScript ตรวจว่ามือถือเปิด mock location อยู่หรือไม่

**JavaScript ตรวจ GPS:**
```javascript
navigator.geolocation.getCurrentPosition(function(position) {
    var data = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        // Android Chrome สามารถบอกได้ว่าเป็น mock หรือไม่
        is_mock: position.coords.isMock || false
    };
    // ส่งไป server
});
```

### ชั้น 2: Device Fingerprint (ผูกเครื่อง)
- ใช้ library: **FingerprintJS** (https://fingerprint.com) เวอร์ชันฟรี
- ตอนลงทะเบียนจะเก็บ fingerprint ของมือถือไว้
- ตอนสแกนเช็คชื่อ จะเทียบ fingerprint ปัจจุบัน กับ ที่ลงทะเบียน
- ถ้าไม่ตรง → flag `device_mismatch`
- ถ้ามือถือเครื่องเดียวสแกนให้หลายคนในวันเดียว → flag `multi_scan`

### ชั้น 3: เซลฟี่บังคับ (Selfie Verification)
- ทุกครั้งที่เช็คชื่อ ระบบบังคับเปิดกล้องหน้าถ่ายเซลฟี่
- รูปถูกอัพโหลดไป **Google Drive** อัตโนมัติ → SQL เก็บเฉพาะ link
- เก็บรูปไว้ใน server ชั่วคราว → อัพขึ้น Drive → ลบไฟล์ local
- admin ตรวจสอบได้ในหน้า dashboard (กดดูรูปจาก Drive link)
- ป้องกันการให้เพื่อนสแกนแทน (หน้าไม่ตรง = จับได้)

### ชั้น 4: ตรวจจับพฤติกรรมผิดปกติ
- **มือถือเครื่องเดียวสแกนหลายคน:** ตรวจ device fingerprint ซ้ำในวันเดียว
- **ความเร็วเดินทางเป็นไปไม่ได้:** สแกนจุด A เวลา 08:00 แล้วสแกนจุด B (ห่าง 5 กม.) เวลา 08:02 → flag `speed_impossible`
- **สแกนนอกเวลาปกติ:** เช่น เช็คชื่อตี 3 ทั้งที่กะเช้า → flag

### ตาราง fraud_alerts เก็บข้อมูลทุจริตที่ตรวจพบ:
- `gps_mismatch` - GPS ไม่ตรงจุดสแกน
- `device_mismatch` - ใช้มือถือคนละเครื่อง
- `multi_scan` - มือถือเครื่องเดียวสแกนหลายคน
- `speed_impossible` - เดินทางเร็วเกินจริง
- `mock_location` - ตรวจพบการปลอม GPS

---

## 📸 ระบบจัดเก็บรูปภาพ Google Drive (Photo Storage)

### เหตุผลที่ใช้ Google Drive:
- **ฟรี 15 GB** → รูปบีบอัดแล้ว ~60KB/รูป เก็บได้หลายปี (~13 ปี สำหรับ 25 คน)
- **ไม่กิน storage ของ server/hosting** → hosting ราคาถูกก็ใช้ได้
- **Admin เปิดดูรูปผ่าน Drive ได้ตรง** โดยไม่ต้องเข้า web app
- **แชร์ให้ผู้บังคับบัญชาตรวจสอบได้** ง่ายๆ ผ่าน link

### โครงสร้างโฟลเดอร์ใน Google Drive:

```
📁 Park-Attendance-Photos/
│
├── 📁 selfies/                          ← รูปเซลฟี่เช็คชื่อ
│   ├── 📁 2026/
│   │   ├── 📁 2026-01/
│   │   │   ├── 📁 2026-01-15/
│   │   │   │   ├── checkin_001_สมชาย_07-58.jpg
│   │   │   │   ├── checkin_002_สมหญิง_08-01.jpg
│   │   │   │   ├── checkout_001_สมชาย_16-05.jpg
│   │   │   │   └── ...
│   │   │   ├── 📁 2026-01-16/
│   │   │   └── ...
│   │   ├── 📁 2026-02/
│   │   └── ...
│   └── ...
│
└── 📁 leave_docs/                       ← เอกสารแจ้งลา
    ├── 📁 2026/
    │   ├── 📁 2026-01/
    │   │   ├── leave_003_สมศรี_ใบรับรองแพทย์.jpg
    │   │   └── ...
    │   ├── 📁 2026-02/
    │   └── ...
    └── ...
```

### รูปแบบชื่อไฟล์:
- เซลฟี่เช็คชื่อ: `{scan_type}_{staff_id}_{ชื่อ}_{HH-MM}.jpg`
  - ตัวอย่าง: `checkin_001_สมชาย_07-58.jpg`
- เอกสารลา: `leave_{staff_id}_{ชื่อ}_{คำอธิบาย}.jpg`
  - ตัวอย่าง: `leave_003_สมศรี_ใบรับรองแพทย์.jpg`

### 📐 ระบบบีบอัดรูปภาพ (Image Compression)

**ปัญหา:** มือถือแต่ละเครื่องถ่ายรูปขนาดต่างกันมาก
| มือถือ | ความละเอียดดิบ | ขนาดไฟล์ดิบ |
|--------|---------------|-------------|
| รุ่นเก่า/ราคาถูก | 2-5 MP | 1-2 MB |
| รุ่นกลาง | 12-16 MP | 3-5 MB |
| รุ่นใหม่/แพง | 48-108 MP | 5-15 MB |

**เป้าหมาย:** ย่อทุกรูปให้เหลือ **~50-80 KB** ต่อรูป ยังเห็นหน้าชัดเจนพอตรวจสอบได้

**ทำไมต้องย่อ:**
- ถ้าไม่ย่อ (เฉลี่ย 4 MB/รูป): 25 คน × 2 ครั้ง/วัน × 4 MB = **200 MB/วัน** → 15 GB เต็มใน ~75 วัน
- ถ้าย่อแล้ว (เฉลี่ย 60 KB/รูป): 25 คน × 2 ครั้ง/วัน × 60 KB = **3 MB/วัน** → 15 GB ใช้ได้ **~13 ปี**

#### กลยุทธ์: บีบอัด 2 ชั้น (Client + Server)

#### ชั้นที่ 1: บีบอัดฝั่งมือถือ (JavaScript - ก่อนส่งขึ้น server)

ทำที่มือถือก่อนเพื่อ **ประหยัดเน็ต** ในพื้นที่ป่าที่สัญญาณไม่ดี

**สำหรับเซลฟี่ (ใช้กล้องหน้า):**
- ย่อเหลือ **480 x 640 px** (พอเห็นหน้าชัด)
- คุณภาพ JPEG: **70%**
- ผลลัพธ์: **~40-70 KB** ต่อรูป

**สำหรับเอกสารลา (ถ่ายรูปใบรับรองแพทย์ ฯลฯ):**
- ย่อเหลือ **800 x 1200 px** (อ่านตัวหนังสือได้)
- คุณภาพ JPEG: **75%**
- ผลลัพธ์: **~80-150 KB** ต่อรูป

**JavaScript Code (ใส่ใน assets/js/camera.js):**
```javascript
/**
 * บีบอัดรูปจากกล้องก่อนส่งขึ้น server
 * @param {File|Blob} imageFile - ไฟล์รูปจากกล้อง
 * @param {string} type - 'selfie' หรือ 'document'
 * @returns {Promise<Blob>} - รูปที่บีบอัดแล้ว
 */
function compressImage(imageFile, type = 'selfie') {
    return new Promise((resolve, reject) => {

        // กำหนดค่าตามประเภทรูป
        const settings = {
            selfie: {
                maxWidth: 480,
                maxHeight: 640,
                quality: 0.70  // JPEG 70%
            },
            document: {
                maxWidth: 800,
                maxHeight: 1200,
                quality: 0.75  // JPEG 75%
            }
        };

        const config = settings[type] || settings.selfie;

        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = function() {
            // คำนวณขนาดใหม่ (รักษาสัดส่วน)
            let width = img.width;
            let height = img.height;

            if (width > config.maxWidth) {
                height = Math.round(height * config.maxWidth / width);
                width = config.maxWidth;
            }
            if (height > config.maxHeight) {
                width = Math.round(width * config.maxHeight / height);
                height = config.maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            // วาดรูปย่อลง canvas
            ctx.drawImage(img, 0, 0, width, height);

            // แปลงเป็น JPEG blob พร้อมบีบอัด
            canvas.toBlob(function(blob) {
                console.log('ขนาดเดิม: ' + (imageFile.size / 1024).toFixed(0) + ' KB');
                console.log('ขนาดหลังบีบ: ' + (blob.size / 1024).toFixed(0) + ' KB');
                resolve(blob);
            }, 'image/jpeg', config.quality);
        };

        img.onerror = reject;
        img.src = URL.createObjectURL(imageFile);
    });
}

/**
 * ถ่ายเซลฟี่จากกล้องหน้า + บีบอัดอัตโนมัติ
 * ใช้กับ <video> element ที่แสดง preview กล้อง
 */
async function captureSelfie(videoElement) {
    const canvas = document.createElement('canvas');

    // ตั้งขนาด capture เป็น 480x640 โดยตรง (ไม่ต้องย่อทีหลัง)
    canvas.width = 480;
    canvas.height = 640;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0, 480, 640);

    return new Promise((resolve) => {
        canvas.toBlob(function(blob) {
            resolve(blob);
        }, 'image/jpeg', 0.70);
    });
}

/**
 * เปิดกล้องหน้าสำหรับถ่ายเซลฟี่
 * ตั้ง resolution ต่ำตั้งแต่แรก เพื่อประหยัด memory + เร็วขึ้น
 */
async function openFrontCamera(videoElement) {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: {
            facingMode: 'user',       // กล้องหน้า
            width: { ideal: 480 },    // ขอ resolution ต่ำตั้งแต่แรก
            height: { ideal: 640 }
        }
    });
    videoElement.srcObject = stream;
    await videoElement.play();
}

/**
 * ส่งรูปที่บีบอัดแล้วไป server
 */
async function uploadCompressedPhoto(blob, scanType, staffId) {
    const formData = new FormData();
    formData.append('photo', blob, 'selfie.jpg');
    formData.append('scan_type', scanType);
    formData.append('staff_id', staffId);

    const response = await fetch('/api/upload_photo.php', {
        method: 'POST',
        body: formData
    });
    return response.json();
}
```

**ตัวอย่าง Flow ในหน้าสแกน (scanner.php):**
```javascript
// เมื่อกดปุ่มเช็คชื่อ → ถ่ายเซลฟี่ → บีบอัด → ส่ง
document.getElementById('btn-capture').addEventListener('click', async () => {
    // 1. ถ่ายรูปจาก video preview (บีบอัดในตัว)
    const blob = await captureSelfie(document.getElementById('camera-preview'));

    // 2. แสดง preview ให้เจ้าหน้าที่ดูก่อนยืนยัน
    document.getElementById('selfie-preview').src = URL.createObjectURL(blob);

    // 3. แสดงขนาดไฟล์
    document.getElementById('file-size').textContent =
        'ขนาดรูป: ' + (blob.size / 1024).toFixed(0) + ' KB';

    // 4. เก็บ blob ไว้ ส่งตอนกดยืนยัน
    window.capturedSelfie = blob;
});

document.getElementById('btn-confirm').addEventListener('click', async () => {
    // ส่งรูปที่บีบอัดแล้วขึ้น server → server อัพต่อขึ้น Google Drive
    const result = await uploadCompressedPhoto(
        window.capturedSelfie, 'check_in', currentStaffId
    );
    // ...
});
```

#### ชั้นที่ 2: บีบอัดซ้ำฝั่ง Server (PHP - เป็น safety net)

กรณี browser เก่าที่ JavaScript compression ไม่ทำงาน หรือไฟล์ยังใหญ่เกิน

**PHP Code (ใส่ใน includes/image_compress.php):**
```php
/**
 * บีบอัดรูปฝั่ง server ก่อนอัพขึ้น Google Drive
 * เรียกใช้: $compressedPath = compressPhoto($originalPath, 'selfie');
 */
function compressPhoto($sourcePath, $type = 'selfie') {
    // กำหนดค่าตามประเภท
    $config = [
        'selfie' => [
            'max_width'  => 480,
            'max_height' => 640,
            'quality'    => 70,       // JPEG quality 70%
            'max_file_kb' => 100      // ถ้าเกิน 100KB ลดคุณภาพอีก
        ],
        'document' => [
            'max_width'  => 800,
            'max_height' => 1200,
            'quality'    => 75,
            'max_file_kb' => 200
        ]
    ];

    $cfg = $config[$type] ?? $config['selfie'];

    // อ่านรูปต้นฉบับ
    $imageInfo = getimagesize($sourcePath);
    $mime = $imageInfo['mime'];

    switch ($mime) {
        case 'image/jpeg': $source = imagecreatefromjpeg($sourcePath); break;
        case 'image/png':  $source = imagecreatefrompng($sourcePath);  break;
        case 'image/webp': $source = imagecreatefromwebp($sourcePath); break;
        default: return $sourcePath; // ไม่รองรับ → ส่งกลับไฟล์เดิม
    }

    $origWidth = imagesx($source);
    $origHeight = imagesy($source);

    // คำนวณขนาดใหม่ (รักษาสัดส่วน)
    $ratio = min($cfg['max_width'] / $origWidth, $cfg['max_height'] / $origHeight, 1);
    $newWidth = round($origWidth * $ratio);
    $newHeight = round($origHeight * $ratio);

    // สร้างรูปใหม่
    $resized = imagecreatetruecolor($newWidth, $newHeight);
    imagecopyresampled($resized, $source, 0, 0, 0, 0,
                       $newWidth, $newHeight, $origWidth, $origHeight);

    // บันทึกเป็น JPEG
    $outputPath = $sourcePath . '_compressed.jpg';
    $quality = $cfg['quality'];
    imagejpeg($resized, $outputPath, $quality);

    // ถ้ายังใหญ่เกิน → ลดคุณภาพลงอีกทีละ 5%
    while (filesize($outputPath) > $cfg['max_file_kb'] * 1024 && $quality > 30) {
        $quality -= 5;
        imagejpeg($resized, $outputPath, $quality);
    }

    // Cleanup
    imagedestroy($source);
    imagedestroy($resized);

    $originalKB = round(filesize($sourcePath) / 1024);
    $compressedKB = round(filesize($outputPath) / 1024);
    error_log("Image compressed: {$originalKB}KB → {$compressedKB}KB (quality: {$quality}%)");

    return $outputPath;
}
```

#### สรุปผลการบีบอัด:

| รายการ | ก่อนบีบอัด | หลังบีบอัด | ประหยัด |
|--------|-----------|-----------|---------|
| เซลฟี่ (มือถือรุ่นเก่า) | ~1.5 MB | ~40 KB | 97% |
| เซลฟี่ (มือถือรุ่นใหม่) | ~8 MB | ~65 KB | 99% |
| เอกสารลา (ใบรับรองแพทย์) | ~5 MB | ~120 KB | 98% |
| **เฉลี่ยต่อวัน (25 คน × 2 ครั้ง)** | **~200 MB** | **~3 MB** | **98%** |
| **ต่อเดือน** | **~6 GB** | **~90 MB** | - |
| **ต่อปี** | **~73 GB** | **~1.1 GB** | - |
| **15 GB Drive เก็บได้** | **~75 วัน** | **~13 ปี** | - |

> **ข้อสำคัญ:** 480 x 640 px คุณภาพ 70% → เห็นหน้าชัดเจนเพียงพอสำหรับยืนยันตัวตน
> ถ้าต้องการชัดกว่านี้สามารถปรับเป็น 640 x 960 px (ไฟล์จะเพิ่มเป็น ~100 KB)

### Flow การอัพโหลดรูป (ปรับใหม่ รวมการบีบอัด):

```
เจ้าหน้าที่ถ่ายเซลฟี่ / แนบเอกสารลา
        │
        ▼
🔹 ชั้นที่ 1: บีบอัดในมือถือ (JavaScript)
   กล้องหน้าตั้ง resolution ต่ำ 480x640 ตั้งแต่แรก
   Canvas ย่อ + JPEG quality 70%
   ผลลัพธ์: ~50-70 KB (จากเดิม 3-8 MB)
        │
        ▼
ส่งรูปที่บีบอัดแล้วไป server (เร็ว แม้เน็ตช้าในป่า)
        │
        ▼
🔹 ชั้นที่ 2: เช็คซ้ำฝั่ง Server (PHP)
   ถ้ารูปยังใหญ่เกิน 100KB → บีบอัดซ้ำด้วย GD Library
   ลดคุณภาพทีละ 5% จนไฟล์เล็กกว่า limit
        │
        ▼
PHP บันทึกไฟล์บีบอัดแล้วใน /tmp/
        │
        ▼
PHP เรียก Google Drive API:
  1. เช็ค/สร้างโฟลเดอร์ตาม ปี → เดือน → วันที่
  2. อัพโหลดไฟล์เข้าโฟลเดอร์ที่ถูกต้อง
  3. Set permission เป็น "anyone with link can view"
  4. ได้ Drive file ID กลับมา
        │
        ▼
สร้าง viewable link:
  https://drive.google.com/file/d/{fileId}/view
        │
        ▼
บันทึก link + ขนาดไฟล์ ลง MySQL (selfie_photo_url / attachment_url)
        │
        ▼
ลบไฟล์ชั่วคราวออกจาก server
```

### วิธีเชื่อม Google Drive API:

**ใช้ Service Account** (แนะนำ เหมาะกับ server-to-server):
1. สร้าง Google Cloud Project
2. เปิดใช้ Google Drive API
3. สร้าง Service Account → ดาวน์โหลด JSON key file
4. สร้างโฟลเดอร์ `Park-Attendance-Photos` ใน Google Drive
5. แชร์โฟลเดอร์ให้ Service Account email (xxxxxx@xxxxx.iam.gserviceaccount.com)
6. ใส่ JSON key file ไว้ใน server (config/google_credentials.json)

**PHP Code ตัวอย่าง:**
```php
// includes/google_drive.php
require_once 'vendor/autoload.php'; // Google API PHP Client

function uploadToDrive($filePath, $fileName, $folderType = 'selfies') {
    $client = new Google\Client();
    $client->setAuthConfig('config/google_credentials.json');
    $client->addScope(Google\Service\Drive::DRIVE_FILE);
    $service = new Google\Service\Drive($client);

    // หาหรือสร้างโฟลเดอร์ตาม ปี/เดือน/วัน
    $year = date('Y');
    $month = date('Y-m');
    $day = date('Y-m-d');

    $rootFolderId = getOrCreateFolder($service, 'Park-Attendance-Photos', null);
    $typeFolderId = getOrCreateFolder($service, $folderType, $rootFolderId);
    $yearFolderId = getOrCreateFolder($service, $year, $typeFolderId);
    $monthFolderId = getOrCreateFolder($service, $month, $yearFolderId);
    $dayFolderId = getOrCreateFolder($service, $day, $monthFolderId);

    // อัพโหลดไฟล์
    $fileMetadata = new Google\Service\Drive\DriveFile([
        'name' => $fileName,
        'parents' => [$dayFolderId]
    ]);
    $content = file_get_contents($filePath);
    $file = $service->files->create($fileMetadata, [
        'data' => $content,
        'mimeType' => 'image/jpeg',
        'uploadType' => 'multipart'
    ]);

    // ตั้งค่าให้ใครมี link ก็ดูได้
    $permission = new Google\Service\Drive\Permission([
        'type' => 'anyone',
        'role' => 'reader'
    ]);
    $service->permissions->create($file->id, $permission);

    // Return viewable link
    return 'https://drive.google.com/file/d/' . $file->id . '/view';
}

function getOrCreateFolder($service, $folderName, $parentId) {
    // ค้นหาโฟลเดอร์ที่มีอยู่แล้ว
    $query = "name='{$folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false";
    if ($parentId) $query .= " and '{$parentId}' in parents";

    $results = $service->files->listFiles(['q' => $query, 'spaces' => 'drive']);

    if (count($results->getFiles()) > 0) {
        return $results->getFiles()[0]->getId();
    }

    // สร้างใหม่ถ้ายังไม่มี
    $folderMetadata = new Google\Service\Drive\DriveFile([
        'name' => $folderName,
        'mimeType' => 'application/vnd.google-apps.folder',
        'parents' => $parentId ? [$parentId] : []
    ]);
    $folder = $service->files->create($folderMetadata);
    return $folder->id;
}
```

### ข้อมูลที่ SQL เก็บ (เฉพาะ link):
```
selfie_photo_url = "https://drive.google.com/file/d/1aBcDeFgHiJ/view"
attachment_url   = "https://drive.google.com/file/d/2kLmNoPqRsT/view"
```

### Thumbnail สำหรับแสดงใน Dashboard:
- ใช้ URL: `https://drive.google.com/thumbnail?id={fileId}&sz=w200`
- Admin ดูรูปย่อใน dashboard ได้เลย กดแล้วเปิดรูปเต็มใน Drive

---

## 📝 ระบบแจ้งลา (Leave Request)

### ประเภทการลา:
- ลาป่วย (sick)
- ลากิจ (personal)
- ลาพักร้อน (annual)
- ลาเร่งด่วน (urgent)
- อื่นๆ (other)

### ขั้นตอน:
1. เจ้าหน้าที่เปิดหน้า "แจ้งลา" ใน web app
2. เลือกประเภทการลา, วันที่เริ่ม-สิ้นสุด, เหตุผล
3. แนบเอกสาร (ถ้ามี เช่น ใบรับรองแพทย์) → อัพโหลดขึ้น **Google Drive** โฟลเดอร์ `leave_docs/{ปี}/{เดือน}/`
4. กดส่ง → สถานะ = `pending`
5. ระบบส่ง LINE แจ้ง admin ว่ามีใบลารออนุมัติ
6. admin กด อนุมัติ/ปฏิเสธ ในหน้า dashboard
7. ระบบส่ง LINE แจ้งเจ้าหน้าที่คนนั้นว่าผลอนุมัติเป็นอย่างไร
8. ถ้าอนุมัติ → วันที่ลาจะแสดงในสรุปรายวันเป็น `leave` ไม่นับเป็นขาด

---

## 🔔 ระบบแจ้งเตือน LINE (LINE Notifications)

### ใช้ LINE Messaging API ส่งแจ้งเตือนอัตโนมัติ:

| เหตุการณ์ | ส่งถึง | ข้อความตัวอย่าง |
|-----------|--------|-----------------|
| เช็คชื่อสำเร็จ (ตรงเวลา) | กลุ่ม LINE งาน | ✅ นาย ก. เช็คชื่อ จุดด่าน A เวลา 07:58 ตรงเวลา |
| เช็คชื่อสาย | กลุ่ม + admin | ⚠️ นาย ข. เช็คชื่อ จุดด่าน B เวลา 08:22 (สาย 22 นาที) |
| ตรวจพบทุจริต | admin ส่วนตัว | 🚨 แจ้งเตือน: นาย ค. GPS ไม่ตรงจุดสแกน (ห่าง 2.3 กม.) |
| มีใบลาใหม่ | admin ส่วนตัว | 📝 นาย ง. ขอลาป่วย 18-19 ก.พ. รออนุมัติ |
| ผลอนุมัติลา | เจ้าหน้าที่คนนั้น | ✅ ใบลาของคุณ (ลาป่วย 18-19 ก.พ.) ได้รับอนุมัติแล้ว |
| สรุปประจำวัน (ส่งตอนเย็น) | admin ส่วนตัว | 📊 สรุป 17 ก.พ.: มา 20 / สาย 3 / ขาด 1 / ลา 1 |

---

## 📊 หน้าจอในระบบ (Pages)

### สำหรับเจ้าหน้าที่ทั่วไป (staff):

| หน้า | ฟีเจอร์ |
|------|---------|
| **หน้าหลัก** | สถานะวันนี้ (เช็คชื่อแล้ว/ยังไม่เช็ค), ปุ่มเช็คชื่อเข้า-ออก |
| **สแกน QR** | เปิดกล้องสแกน QR → ตรวจสอบ → ถ่ายเซลฟี่ → บันทึก |
| **ประวัติตัวเอง** | ดูสถิติเช็คชื่อ ย้อนหลัง: ตรงเวลา/สาย/ขาด/ลา แต่ละวัน |
| **แจ้งลา** | ฟอร์มส่งใบลา + ดูสถานะใบลา (pending/approved/rejected) |
| **โปรไฟล์** | ดู/แก้ไขข้อมูลส่วนตัว |

### สำหรับหัวหน้า (admin):

| หน้า | ฟีเจอร์ |
|------|---------|
| **Dashboard** | สรุปภาพรวมวันนี้: จำนวนมา/สาย/ขาด/ลา, รายการผิดปกติล่าสุด |
| **รายชื่อเจ้าหน้าที่** | ดูรายชื่อทั้งหมด, เพิ่ม/ลบ/แก้ไข, อนุมัติคนลงทะเบียนใหม่, กำหนด role |
| **จัดการจุดสแกน** | เพิ่ม/แก้ไข/ลบจุด, กำหนดพิกัด+รัศมี, Generate + ปริ้น QR Code |
| **จัดการกะงาน** | สร้าง/แก้ไขกะ (เช้า/บ่าย/ดึก), มอบหมายเจ้าหน้าที่เข้ากะ+จุด |
| **รายงานเช็คชื่อ** | ตารางเช็คชื่อรายวัน/รายเดือน, ฟิลเตอร์ตามคน/จุด/สถานะ, ดูรูปเซลฟี่ |
| **แจ้งเตือนทุจริต** | รายการ fraud alerts ทั้งหมด, กดตรวจสอบ+ปิดเคส+บันทึกหมายเหตุ |
| **อนุมัติลา** | รายการใบลาที่รอ, กดอนุมัติ/ปฏิเสธ |
| **รายงานสรุป** | สรุปรายเดือน ส่งผู้บังคับบัญชา, Export เป็น Excel/PDF |
| **ตั้งค่าระบบ** | กำหนดเวลาสาย/ขาด, ตั้งค่า LINE Bot, ตั้งค่า GPS รัศมี default |

---

## 🗄️ โครงสร้างฐานข้อมูล MySQL

### ตาราง 1: staff (เจ้าหน้าที่)
```sql
CREATE TABLE staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    line_user_id VARCHAR(50) UNIQUE NOT NULL,  -- ได้จาก LINE Login
    employee_id VARCHAR(20) UNIQUE,            -- รหัสพนักงาน (ถ้ามี)
    full_name VARCHAR(100) NOT NULL,
    position VARCHAR(50),
    phone VARCHAR(15),
    role ENUM('admin','staff') DEFAULT 'staff',
    device_fingerprint VARCHAR(255),           -- จาก FingerprintJS
    profile_photo_url VARCHAR(255),            -- รูปโปรไฟล์จาก LINE
    status ENUM('pending','active','inactive') DEFAULT 'pending',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### ตาราง 2: scan_stations (จุดสแกน QR)
```sql
CREATE TABLE scan_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station_name VARCHAR(100) NOT NULL,        -- เช่น "ด่านตรวจ A"
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    radius_meters INT DEFAULT 150,             -- รัศมีที่ยอมรับ
    secret_key VARCHAR(64) NOT NULL,           -- ใช้ใน QR URL
    description TEXT,                          -- คำอธิบายจุด
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### ตาราง 3: work_shifts (กะงาน)
```sql
CREATE TABLE work_shifts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shift_name VARCHAR(50) NOT NULL,           -- เช่น "กะเช้า"
    start_time TIME NOT NULL,                  -- 08:00:00
    end_time TIME NOT NULL,                    -- 16:00:00
    late_after_minutes INT DEFAULT 15,
    very_late_after_minutes INT DEFAULT 30,
    absent_after_minutes INT DEFAULT 60,
    is_active TINYINT(1) DEFAULT 1
);
```

### ตาราง 4: staff_assignments (มอบหมายกะ+จุด)
```sql
CREATE TABLE staff_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    shift_id INT NOT NULL,
    station_id INT NOT NULL,
    effective_date DATE NOT NULL,
    end_date DATE,                             -- NULL = ไม่มีกำหนดสิ้นสุด
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (shift_id) REFERENCES work_shifts(id),
    FOREIGN KEY (station_id) REFERENCES scan_stations(id)
);
```

### ตาราง 5: attendance_logs (บันทึกการสแกน - ตารางหลัก)
```sql
CREATE TABLE attendance_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    station_id INT NOT NULL,
    scan_type ENUM('check_in','check_out') NOT NULL,
    scanned_at DATETIME NOT NULL,

    -- ข้อมูลป้องกันทุจริต
    gps_latitude DECIMAL(10,8),
    gps_longitude DECIMAL(11,8),
    gps_accuracy DECIMAL(8,2),                -- ความแม่นยำ GPS (เมตร)
    gps_distance_meters DECIMAL(8,2),          -- ห่างจากจุดสแกนกี่เมตร
    is_mock_location TINYINT(1) DEFAULT 0,     -- ตรวจพบ fake GPS?
    selfie_photo_url VARCHAR(255),             -- Google Drive link รูปเซลฟี่
    selfie_file_size_kb INT,                   -- ขนาดไฟล์หลังบีบอัด (KB) เพื่อ monitor
    device_fingerprint VARCHAR(255),
    device_user_agent TEXT,
    device_ip VARCHAR(45),

    -- ผลการตรวจสอบ
    status ENUM('on_time','late','very_late','suspicious') NOT NULL,
    late_minutes INT DEFAULT 0,
    flag_reasons TEXT,                         -- JSON array ของเหตุผล flag
    is_verified TINYINT(1) DEFAULT 0,          -- admin ยืนยันแล้วหรือยัง

    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (station_id) REFERENCES scan_stations(id),
    INDEX idx_staff_date (staff_id, scanned_at),
    INDEX idx_date (scanned_at)
);
```

### ตาราง 6: daily_summary (สรุปรายวัน)
```sql
CREATE TABLE daily_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    work_date DATE NOT NULL,
    shift_id INT,
    station_id INT,
    check_in_time DATETIME,
    check_out_time DATETIME,
    status ENUM('present','late','very_late','absent','leave','day_off') NOT NULL,
    late_minutes INT DEFAULT 0,
    work_hours DECIMAL(4,2),                   -- ชั่วโมงทำงานจริง
    notes TEXT,
    UNIQUE KEY unique_staff_date (staff_id, work_date),
    FOREIGN KEY (staff_id) REFERENCES staff(id)
);
```

### ตาราง 7: leave_requests (ใบลา)
```sql
CREATE TABLE leave_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    leave_type ENUM('sick','personal','annual','urgent','other') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT,
    attachment_url VARCHAR(255),               -- Google Drive link ใบรับรองแพทย์ ฯลฯ
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    approved_by INT,
    approved_at DATETIME,
    reject_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (approved_by) REFERENCES staff(id)
);
```

### ตาราง 8: fraud_alerts (แจ้งเตือนทุจริต)
```sql
CREATE TABLE fraud_alerts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    attendance_log_id INT,
    alert_type ENUM('gps_mismatch','device_mismatch','multi_scan','speed_impossible','mock_location') NOT NULL,
    description TEXT,
    evidence_data TEXT,                        -- JSON ข้อมูลหลักฐาน
    is_resolved TINYINT(1) DEFAULT 0,
    resolved_by INT,
    resolved_note TEXT,
    resolved_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (attendance_log_id) REFERENCES attendance_logs(id),
    FOREIGN KEY (resolved_by) REFERENCES staff(id)
);
```

### ตาราง 9: system_settings (ตั้งค่าระบบ)
```sql
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ค่าเริ่มต้น
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('default_radius_meters', '150', 'รัศมี GPS เริ่มต้น (เมตร)'),
('late_threshold_minutes', '15', 'สายหลังกี่นาที'),
('absent_threshold_minutes', '60', 'ขาดหลังกี่นาที'),
('line_channel_token', '', 'LINE Messaging API Channel Access Token'),
('line_admin_user_id', '', 'LINE User ID ของ admin สำหรับรับแจ้งเตือน'),
('line_group_id', '', 'LINE Group ID สำหรับส่งสรุป'),
('daily_summary_time', '17:00', 'เวลาส่งสรุปประจำวัน'),
('gdrive_root_folder_id', '', 'Google Drive Folder ID ของโฟลเดอร์หลัก Park-Attendance-Photos'),
('gdrive_selfie_folder_id', '', 'Google Drive Folder ID ของโฟลเดอร์ selfies'),
('gdrive_leave_folder_id', '', 'Google Drive Folder ID ของโฟลเดอร์ leave_docs'),
('selfie_max_width', '480', 'ความกว้างสูงสุดเซลฟี่ (px)'),
('selfie_max_height', '640', 'ความสูงสูงสุดเซลฟี่ (px)'),
('selfie_jpeg_quality', '70', 'คุณภาพ JPEG เซลฟี่ (1-100)'),
('selfie_max_file_kb', '100', 'ขนาดไฟล์สูงสุดเซลฟี่ (KB)'),
('doc_max_width', '800', 'ความกว้างสูงสุดเอกสารลา (px)'),
('doc_max_height', '1200', 'ความสูงสูงสุดเอกสารลา (px)'),
('doc_jpeg_quality', '75', 'คุณภาพ JPEG เอกสารลา (1-100)'),
('doc_max_file_kb', '200', 'ขนาดไฟล์สูงสุดเอกสารลา (KB)');
```

### ตาราง 10: upload_queue (คิวอัพโหลดรูปขึ้น Google Drive)
```sql
-- สำหรับกรณีอินเตอร์เน็ตไม่ดี อัพโหลดไม่สำเร็จ ระบบจะ retry ทีหลัง
CREATE TABLE upload_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_type ENUM('selfie','leave_doc') NOT NULL, -- ประเภทรูป
    reference_id INT NOT NULL,                          -- attendance_logs.id หรือ leave_requests.id
    local_file_path VARCHAR(255) NOT NULL,              -- path ไฟล์ใน server
    target_folder VARCHAR(50) NOT NULL,                 -- 'selfies' หรือ 'leave_docs'
    file_name VARCHAR(255) NOT NULL,                    -- ชื่อไฟล์ที่จะตั้งใน Drive
    status ENUM('pending','uploading','success','failed') DEFAULT 'pending',
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 5,
    error_message TEXT,
    drive_url VARCHAR(255),                             -- URL หลังอัพสำเร็จ
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_at DATETIME
);
```
> **Cron job** `cron/process_upload_queue.php` จะรันทุก 5 นาที เพื่ออัพโหลดไฟล์ที่ค้างใน queue

---

## 📁 โครงสร้างไฟล์โปรเจกต์

```
/attendance-app/
│
├── config/
│   ├── database.php              # เชื่อมต่อ MySQL (PDO)
│   ├── line_config.php           # LINE Login + Messaging API keys
│   ├── google_credentials.json   # Google Service Account key (ห้าม commit ขึ้น git)
│   └── app_config.php            # ค่าตั้งต่างๆ ของ app (รวม Drive folder ID)
│
├── includes/
│   ├── auth.php              # ตรวจสอบ login, session, สิทธิ์
│   ├── functions.php         # ฟังก์ชันกลาง (haversine, format date ฯลฯ)
│   ├── line_api.php          # ฟังก์ชันส่ง LINE notification
│   ├── fraud_check.php       # ฟังก์ชันตรวจจับทุจริต
│   ├── google_drive.php      # ฟังก์ชันอัพโหลด/จัดการรูปใน Google Drive
│   └── image_compress.php    # บีบอัดรูปฝั่ง server (safety net)
│
├── api/                      # API endpoints (รับ-ส่ง JSON)
│   ├── scan.php              # POST - รับข้อมูลการสแกน QR
│   ├── upload_photo.php      # POST - รับรูปเซลฟี่/เอกสาร → บีบอัด → อัพ Drive
│   ├── leave_request.php     # POST - ส่งใบลา, GET - ดูใบลา
│   ├── attendance.php        # GET - ดึงข้อมูลเช็คชื่อ
│   ├── staff.php             # CRUD เจ้าหน้าที่ (admin only)
│   ├── stations.php          # CRUD จุดสแกน (admin only)
│   ├── shifts.php            # CRUD กะงาน (admin only)
│   ├── approve_leave.php     # POST - อนุมัติ/ปฏิเสธลา (admin only)
│   ├── fraud_alerts.php      # GET/POST - ดู/จัดการ alerts (admin only)
│   └── reports.php           # GET - รายงานสรุป (admin only)
│
├── auth/
│   ├── line_login.php        # Redirect ไป LINE Login
│   ├── line_callback.php     # Callback จาก LINE → สร้าง/login user
│   ├── register.php          # หน้ากรอกข้อมูลลงทะเบียน
│   └── logout.php            # ออกจากระบบ
│
├── pages/                    # หน้า HTML (ส่วนแสดงผล)
│   │
│   ├── staff/                # หน้าสำหรับเจ้าหน้าที่
│   │   ├── home.php          # หน้าหลัก + ปุ่มเช็คชื่อ
│   │   ├── scanner.php       # หน้าสแกน QR + ถ่ายเซลฟี่
│   │   ├── history.php       # ประวัติเช็คชื่อตัวเอง
│   │   ├── leave_form.php    # ฟอร์มแจ้งลา
│   │   └── profile.php       # โปรไฟล์
│   │
│   └── admin/                # หน้าสำหรับหัวหน้า
│       ├── dashboard.php     # Dashboard สรุปภาพรวม
│       ├── staff_list.php    # จัดการเจ้าหน้าที่
│       ├── stations.php      # จัดการจุดสแกน + ปริ้น QR
│       ├── shifts.php        # จัดการกะงาน
│       ├── attendance.php    # รายงานเช็คชื่อ + ดูรูปเซลฟี่
│       ├── fraud_alerts.php  # รายการทุจริตที่ตรวจพบ
│       ├── leave_approve.php # อนุมัติใบลา
│       ├── reports.php       # รายงานสรุป + Export
│       └── settings.php      # ตั้งค่าระบบ
│
├── assets/
│   ├── css/style.css         # CSS (ใช้ mobile-first design)
│   ├── js/
│   │   ├── scanner.js        # ใช้ library html5-qrcode สำหรับสแกน QR
│   │   ├── camera.js         # จัดการกล้องถ่ายเซลฟี่
│   │   ├── gps.js            # ดึง GPS + ตรวจ mock location
│   │   └── fingerprint.js    # Device fingerprint (FingerprintJS)
│   └── img/
│
├── uploads/
│   └── temp/                 # เก็บรูปชั่วคราว ก่อนอัพขึ้น Google Drive แล้วลบ
│
├── cron/
│   ├── daily_summary.php         # Cron job: สร้างสรุปรายวัน + ส่ง LINE ตอนเย็น
│   ├── mark_absent.php           # Cron job: mark absent สำหรับคนที่ไม่เช็คชื่อ
│   └── process_upload_queue.php  # Cron job: ทุก 5 นาที อัพรูปที่ค้างขึ้น Google Drive
│
├── qr_generator.php          # หน้า generate + ปริ้น QR Code
├── scan.php                  # Landing page เมื่อสแกน QR (redirect ไป scanner)
└── index.php                 # Entry point → redirect ตาม role
```

---

## 🔧 Libraries / Dependencies ที่ต้องใช้

| Library | ใช้ทำอะไร | วิธีติดตั้ง |
|---------|-----------|------------|
| **html5-qrcode** | สแกน QR Code ผ่านกล้องมือถือ | CDN: `<script src="html5-qrcode.min.js">` |
| **FingerprintJS** | สร้าง device fingerprint | CDN: `<script src="@fingerprintjs/fingerprintjs">` |
| **phpqrcode** | สร้าง QR Code image (ฝั่ง server) | ดาวน์โหลด library ใส่โปรเจกต์ |
| **google/apiclient** | เชื่อม Google Drive API (อัพโหลดรูป) | `composer require google/apiclient:^2.0` |
| **LINE Login SDK** | OAuth2 login ด้วย LINE | เรียก API ตรง (ไม่ต้องลง SDK) |
| **LINE Messaging API** | ส่งข้อความแจ้งเตือน | เรียก API ตรงด้วย cURL |
| **PHPSpreadsheet** (optional) | Export รายงานเป็น Excel | composer require phpoffice/phpspreadsheet |
| **TCPDF** (optional) | Export รายงานเป็น PDF | composer require tecnickcom/tcpdf |

---

## 🔑 สิ่งที่ต้องเตรียมก่อนเริ่ม

1. **LINE Developers Account:**
   - สร้าง LINE Login Channel → ได้ Channel ID + Channel Secret
   - สร้าง Messaging API Channel → ได้ Channel Access Token
   - ตั้ง Callback URL สำหรับ LINE Login

2. **Google Cloud Project (สำหรับ Drive API):**
   - สร้าง Google Cloud Project ที่ https://console.cloud.google.com
   - เปิดใช้ Google Drive API
   - สร้าง Service Account → ดาวน์โหลด JSON key file
   - สร้างโฟลเดอร์ `Park-Attendance-Photos` ใน Google Drive (ของ admin)
   - แชร์โฟลเดอร์ให้ Service Account email เป็น Editor
   - เก็บ JSON key file ไว้ใน server ที่ config/google_credentials.json

3. **Hosting / Server:**
   - PHP 7.4+ (แนะนำ 8.0+) พร้อม **GD Library** (สำหรับบีบอัดรูปฝั่ง server)
   - MySQL 5.7+ (หรือ MariaDB 10.3+)
   - SSL (https) → บังคับสำหรับ LINE Login และ GPS API
   - Composer (สำหรับลง google/apiclient)
   - ไม่ต้องมี storage เยอะ เพราะรูปเก็บใน Google Drive (รูปบีบอัดแล้ว ~60KB/รูป)

3. **Domain Name:**
   - เช่น `attendance.erawan-park.com` หรือใช้ subdomain ฟรี

4. **ข้อมูลจุดสแกน:**
   - ชื่อจุดแต่ละจุด
   - พิกัด GPS ของแต่ละจุด (ใช้ Google Maps กดหาพิกัดได้)
   - รัศมีที่ยอมรับ (เช่น 100-200 เมตร ตามสภาพพื้นที่)

5. **ข้อมูลกะงาน:**
   - กะเช้า: เวลาเริ่ม-สิ้นสุด
   - กะอื่นๆ (ถ้ามี)
   - จำนวนนาทีที่ถือว่าสาย/ขาด

---

## ⚡ ลำดับการพัฒนา (แนะนำ)

### Phase 1: ฐานระบบ (สัปดาห์ที่ 1)
- [ ] สร้างฐานข้อมูล MySQL ทุกตาราง
- [ ] ระบบ config + เชื่อมต่อ DB
- [ ] LINE Login (ลงทะเบียน + เข้าสู่ระบบ)
- [ ] เชื่อม Google Drive API (Service Account + สร้างโฟลเดอร์โครงสร้าง)
- [ ] หน้า admin อนุมัติผู้ใช้ใหม่
- [ ] ระบบ session + ตรวจสอบสิทธิ์

### Phase 2: ระบบเช็คชื่อ (สัปดาห์ที่ 2)
- [ ] หน้าสแกน QR Code (html5-qrcode)
- [ ] ดึง GPS + ตรวจระยะทาง
- [ ] ถ่ายเซลฟี่บังคับ → อัพโหลดขึ้น Google Drive → เก็บ link ใน DB
- [ ] Device fingerprint
- [ ] บันทึก attendance_logs
- [ ] คำนวณสถานะ (ตรงเวลา/สาย/ขาด)
- [ ] Admin: จัดการจุดสแกน + Generate QR ปริ้น

### Phase 3: ป้องกันทุจริต + แจ้งลา (สัปดาห์ที่ 3)
- [ ] Fraud detection ทุกชั้น
- [ ] ฟอร์มแจ้งลา + อัพโหลดเอกสารขึ้น Google Drive (โฟลเดอร์ leave_docs)
- [ ] Admin อนุมัติ/ปฏิเสธลา
- [ ] LINE notifications ทุกเหตุการณ์

### Phase 4: Dashboard + รายงาน (สัปดาห์ที่ 4)
- [ ] Admin Dashboard สรุปภาพรวม
- [ ] หน้าดูรูปเซลฟี่ + fraud alerts
- [ ] รายงานรายเดือน
- [ ] Cron job สรุปรายวัน
- [ ] Export Excel/PDF
- [ ] เจ้าหน้าที่ดูประวัติตัวเอง

---

## 📱 หมายเหตุเรื่อง UI/UX

- **ออกแบบ Mobile-first** เจ้าหน้าที่ใช้มือถือ 100%
- ปุ่มใหญ่ กดง่าย ไม่ต้องพิมพ์เยอะ
- ใช้สีเขียว/แดง/เหลือง บอกสถานะชัดเจน
- หน้าสแกน QR ต้องเปิดเร็ว ไม่กี่วินาที
- รองรับ offline บางส่วน (ถ้าสัญญาณไม่ดีในป่า → เก็บข้อมูลไว้ก่อน sync ทีหลัง)

---

## ⚠️ ข้อจำกัดที่ต้องรู้

1. **GPS ในป่าอาจคลาดเคลื่อน** → ตั้งรัศมียอมรับกว้างหน่อย (150-200 เมตร)
2. **อินเตอร์เน็ตอาจไม่เสถียร** → ควรทำ offline queue ส่งข้อมูลทีหลัง (รูปเก็บในมือถือก่อน อัพทีหลัง)
3. **Device Fingerprint ไม่ 100%** → อาจเปลี่ยนเมื่ออัพเดท browser ต้องมีระบบ re-register
4. **เซลฟี่ไม่ได้ใช้ Face Recognition** → เป็นการตรวจสอบด้วยคน (admin ดูรูป) ไม่ใช่ AI
5. **QR คงที่มีความเสี่ยง** → ถ้าคนนอกถ่ายรูป QR ไปได้ ต้องพึ่ง GPS + Device + Selfie เป็นหลัก
6. **Google Drive ฟรี 15 GB** → หลังบีบอัดรูปแล้วเหลือ ~60KB/รูป เก็บได้ **~13 ปี** (25 คน × 2 ครั้ง/วัน) ถ้าเต็มสามารถลบรูปเก่าหรืออัพเกรด Google One
7. **Google Drive API มี quota** → ฟรี 1 พันล้าน queries/วัน ไม่มีปัญหาสำหรับ 25 คน
8. **ถ้าอินเตอร์เน็ตไม่ดีตอนอัพรูป** → ระบบควรมี retry mechanism + queue อัพโหลดทีหลัง
