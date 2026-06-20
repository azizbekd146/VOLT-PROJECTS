# 🛡️ Barqarorlik & Xatoni Oldini Olish Qo'llanmasi

## ✅ Qo'shilgan Xavfsizlik Choralari

### 1. **Environment Validation** (`src/utils/envValidator.js`)
- Ilovani ishga tushganida barcha kerakli environment variables tekshiriladi
- API key va boshqa muhim ma'lumotlar yo'qligini avtomatik aniqlaydi

### 2. **Error Boundary** (`src/components/common/ErrorBoundary.jsx`)
- React xatolarini ushlaydi va foydalanuvchiga xabar beradi
- Production da oynalar buzilmasdan, xatolarni korib-tutatadi

### 3. **Enhanced Error Handling in Gemini API**
- API xatolarini batafsil xabar beradi
- Network xatolarini tekshiradi
- User-friendly xato xabarlari

### 4. **Code Quality Tools**

#### ESLint (`eslint.config.js`)
```bash
npm run lint        # Xatolarni tekshirish
npm run lint:fix    # Xatolarni avtomatik tuzatish
```

#### Prettier (`.prettierrc`)
```bash
npm run format        # Kodni formatlash
npm run format:check  # Format tekshirish
```

### 5. **Advanced GeminiExample Component**
- Matn chiqarish limiti (2000 ta belgigacha)
- Real-time amal chiqarish feedback
- Tozala tugmasi
- Ctrl+Enter hotkey support
- Mafkurali xato xabar ko'rsatish

## 🚀 Ishlatish

### Development rejimida ishga tushirish
```bash
npm run dev
# http://localhost:5174/ ga o'ting
```

### Linting va formatting
```bash
# Linting xatolarini tekshirish
npm run lint

# Linting xatolarini tuzatish
npm run lint:fix

# Kodni formatlash
npm run format

# Format tekshirish
npm run format:check
```

### Production uchun build
```bash
npm run build       # Build qilish
npm run preview     # Yuqori samarali preview
```

## 🔑 API Kaliti Sozlash

1. `.env.local` faylini oching
2. Quyidagi qatorni qo'shing:
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

3. API keyni olish: https://ai.google.dev/tutorials/setup

## 📁 Loyiha Tuzulishi

```
src/
├── api/
│   ├── geminiApi.js          # Gemini API integrations (xatolar bilan)
│   ├── client.js
│   ├── ordersApi.js
│   └── productsApi.js
├── components/
│   └── common/
│       ├── ErrorBoundary.jsx # Xato ushlagich
│       └── GeminiExample.jsx  # Gemini chat komponenti (yaxshilangan)
├── utils/
│   ├── envValidator.js        # Environment tekshiruvi
│   ├── constants.js
│   └── formatCurrency.js
└── ...
```

## 🔍 Xatolar Tekshirish

### Vite import xatosi
**Sabab:** Noto'g'ri import path
**Yechim:** Import path ni tekshiring (relativ yo'llar)

Misol:
```javascript
// ❌ Noto'g'ri
import { geminiClient } from "../api/geminiApi";

// ✅ To'g'ri
import { geminiClient } from "../../api/geminiApi";
```

### API Key xatosi
**Sabab:** `.env.local` faylida VITE_GEMINI_API_KEY mavjud emas
**Yechim:** `.env.local` faylini `.env.example` asosida to'ldiring

### Network xatolar
**Sabab:** Gemini API jaubon bera olmadi
**Yechim:** 
- API key tekshiring
- Internet ulanishini tekshiring
- API rate limit tekshiring

## 🎯 Best Practices

### 1. Har doim try-catch ishlating
```javascript
try {
  const result = await geminiClient.generateText(prompt);
} catch (error) {
  // User-friendly xato bering
  console.error("Xato:", error);
}
```

### 2. Deployment oldin `npm run lint` ishga tushiring
```bash
npm run lint:fix && npm run format && npm run build
```

### 3. Environment variables noto'g'ri kiritilmadi xatosini tekshiring
```bash
# Tuzilishi tekshirish
cat .env.local
```

### 4. Production da console xatolarni ko'rsatish
```javascript
// Development rejimida
if (process.env.NODE_ENV === "development") {
  console.log("Debug info");
}
```

## 📋 Checklist - Deployment oldin

- [ ] `.env.local` faylida API key mavjud
- [ ] `npm run lint` o'tadi xatosiz
- [ ] `npm run format` o'tadi
- [ ] `npm run build` muvaffaqiyatli
- [ ] Barcha import path lar to'g'ri
- [ ] Error Boundary koponenti o'rnatilgan
- [ ] Environment validator koponenti o'rnatilgan

## 🆘 Tezda Yordam

Agar muammo bo'lsa:

1. **Console ni oching** (F12 → Console)
2. **Xato xabarini o'qing**
3. **`npm run lint`** ishga tushiring
4. **`.env.local` ni tekshiring**
5. **Dev server ni qayta ishga tushiring** (`npm run dev`)

---

**Yaratildi:** 2026-06-17  
**Version:** 1.0.0
