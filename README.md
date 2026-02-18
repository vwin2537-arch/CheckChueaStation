# Forest Fire Control - ระบบควบคุมไฟป่า

Web Application สำหรับเจ้าหน้าที่ควบคุมไฟป่า สร้างด้วย Next.js

## โครงสร้างโปรเจค

```
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard page
├── components/             # React components
│   └── ui/                 # UI components (Card, Button, etc.)
├── lib/                    # Utility functions
│   └── utils.ts            # Helper functions
├── public/                 # Static assets
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── tailwind.config.ts      # Tailwind CSS config
└── postcss.config.js       # PostCSS config
```

## การเริ่มต้นใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. รัน Development Server

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) ในเบราว์เซอร์

### 3. Build สำหรับ Production

```bash
npm run build
```

## Features หลัก

- Dashboard แสดงสถานะไฟป่าแบบ Real-time
- แผนที่ความร้อน (Heatmap)
- กราฟแนวโน้มและสถิติ
- ระบบเตือนภัย
- รายงานจุดความร้อน

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components + Lucide Icons
- **Charts**: Recharts

## License

MIT
