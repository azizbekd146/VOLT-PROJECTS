/**
 * Environment variables validator
 * Jismoniy vaqtda kerakli variables mavjud ekanligini tekshiradi
 */

const requiredEnvVars = {
  VITE_GEMINI_API_KEY: "Google Gemini API key",
};

export function validateEnvironment() {
  const missing = [];

  Object.entries(requiredEnvVars).forEach(([key, description]) => {
    if (!import.meta.env[key]) {
      missing.push(`${key} (${description})`);
    }
  });

  if (missing.length > 0) {
    console.error("❌ Yo'qolgan environment variables:", missing);
    console.error("📝 .env.local faylini tekshiring va quyidagi o'zgaruvchilarni qo'shing:");
    missing.forEach((v) => console.error(`   - ${v}`));
    return false;
  }

  console.log("✅ Barcha environment variables tekshirish o'tdi");
  return true;
}
