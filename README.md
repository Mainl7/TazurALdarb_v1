# 🕌 منصة بطاقات جمعية تآزر لرعاية الأيتام

<div dir="rtl">

منصة إلكترونية لإنشاء وتحميل بطاقات التهنئة الإسلامية المخصصة باسم المستخدم.

## ✨ المميزات

- **32 بطاقة** إسلامية فاخرة لـ 4 مناسبات دينية
- **محرر بطاقات** تفاعلي مع سحب وإفلات النص
- **تصدير PNG جودة 4K** مجاناً
- **لوحة تحكم** شاملة مع إحصائيات ورسوم بيانية
- **تصميم RTL** عربي فاخر مع زخارف إسلامية
- **أمان عالي** وفق معايير OWASP

## 🛠️ التقنيات

| الطبقة | التقنية |
|--------|---------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Animations | GSAP 3 |
| Backend | tRPC, NextAuth v5 |
| Database | MySQL + Drizzle ORM |
| Deployment | Docker + Nginx |

## 🚀 التشغيل السريع

### المتطلبات
- Node.js 20+
- MySQL 8.0+

### 1. إعداد البيئة
```bash
cp .env.example .env.local
# عدّل القيم في .env.local
```

### 2. تثبيت الحزم
```bash
npm install
```

### 3. إعداد قاعدة البيانات
```bash
# أنشئ قاعدة البيانات في MySQL
mysql -u root -p -e "CREATE DATABASE tazur_cardz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# ادفع المخطط
npm run db:push

# ابذر البيانات الأولية (4 مناسبات + 32 بطاقة)
npm run db:seed
```

### 4. تشغيل المشروع
```bash
npm run dev
# يفتح على: http://localhost:3000
```

## 🐳 Docker (الإنتاج)

```bash
# انسخ وعدّل متغيرات البيئة
cp .env.example .env

# شغّل مع Docker Compose
docker-compose up -d

# الموقع يعمل على: http://localhost:80
```

## 👑 لوحة التحكم

```
http://localhost:3000/admin/login
```

لمنح صلاحية admin لمستخدم، شغّل في MySQL:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## 📁 هيكل المشروع

```
tazur_cardz/
├── src/
│   ├── app/
│   │   ├── page.tsx              # الصفحة الرئيسية
│   │   ├── cards/                # معرض البطاقات
│   │   ├── editor/[id]/          # محرر البطاقات
│   │   ├── admin/                # لوحة التحكم
│   │   └── api/                  # API routes
│   ├── lib/
│   │   ├── auth.ts               # NextAuth config
│   │   ├── db/                   # Drizzle + Schema
│   │   └── trpc/                 # tRPC routers
│   └── components/
│       └── ui/                   # UI components
├── public/
│   └── cards/                    # صور البطاقات
├── nginx/nginx.conf               # Nginx config
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

## 🔐 الأمان

- OAuth 2.0 (Google) مع NextAuth v5
- RBAC - صلاحيات المدير والمستخدم
- Rate Limiting على API
- Security Headers (CSP, HSTS, X-Frame-Options)
- Input validation بـ Zod
- SQL Injection Protection (Drizzle ORM)
- IP Hashing للخصوصية
- HTTPS Enforcement بـ Nginx

## 📸 تغيير صور البطاقات

ضع الصور في: `public/cards/`
بأسماء:
- `eid-fitr-1.png` ... `eid-fitr-8.png`
- `eid-adha-1.png` ... `eid-adha-8.png`
- `ramadan-1.png` ... `ramadan-8.png`
- `hijri-1.png` ... `hijri-8.png`

أو استخدم **لوحة التحكم** لرفع صور جديدة.

---

**جمعية تآزر لرعاية الأيتام - محافظة الدرب** 🤲
</div>
