import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// 1. System Instruction - AI xarakteri
const defaultSystemInstruction = "Siz dastur foydalanuvchilariga yordam beruvchi aqlli, xushmuomala va qisqa javob beruvchi sun'iy intellekt assistentisiz.";

// 2. Xavfsizlik sozlamalari - Nomaqbul so'zlarni bloklash
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

if (!apiKey) {
    console.warn("Gemini API key is not configured. Set VITE_GEMINI_API_KEY in .env.local");
}

let genAI;
try {
    genAI = new GoogleGenerativeAI(apiKey);
} catch (error) {
    console.error("Gemini client yaratishda xato:", error);
}

/**
 * Gemini API bilan ishlash uchun client
 * Model: gemini-3.5-flash (matn va rasm bilan ishlash uchun)
 */
export const geminiClient = {
    /**
     * Matn generate qilish
     * @param {string} prompt - Sizning so'rovingiz
     * @returns {Promise<string>} Javob
     */
    async generateText(prompt) {
        if (!genAI) {
            throw new Error("Gemini mijoz (client) ishga tushmadi. API key tekshiring.");
        }

        if (!prompt || typeof prompt !== "string") {
            throw new Error("Prompt string bo'lishi kerak");
        }

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: defaultSystemInstruction,
                safetySettings
            });
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            const errorMsg = error.message || "Noma'lum xato";
            console.error("Gemini API xatosi:", errorMsg);

            if (errorMsg.includes("503")) {
                throw new Error("AI serverida vaqtincha yuqori yuklanish kuzatilmoqda. Iltimos, birozdan so'ng qayta urinib ko'ring.");
            }

            if (
                errorMsg.includes("API key") ||
                errorMsg.includes("INVALID_ARGUMENT") ||
                errorMsg.includes("403") ||
                errorMsg.includes("401")
            ) {
                throw new Error(
                    `API key muammosi: ${errorMsg}. Yangi key olish: https://ai.google.dev/tutorials/setup`
                );
            }

            throw new Error(`Gemini xatosi: ${errorMsg}`);
        }
    },

    /**
     * Rasm bilan matn generate qilish
     * @param {string} prompt - Sizning so'rovingiz
     * @param {Object} imagePart - Rasmning maxsus inlineData obyekti
     * @returns {Promise<string>} Javob
     */
    async generateTextWithImage(prompt, imagePart) {
        if (!genAI) {
            throw new Error("Gemini mijoz (client) ishga tushmadi. API key tekshiring.");
        }

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: defaultSystemInstruction,
                safetySettings
            });
            const result = await model.generateContent([prompt, imagePart]);
            return result.response.text();
        } catch (error) {
            console.error("Gemini API xatosi (rasm bilan):", error);
            const errorMsg = error.message || "";
            if (errorMsg.includes("503")) {
                throw new Error("AI serverida vaqtincha yuqori yuklanish kuzatilmoqda. Iltimos, birozdan so'ng qayta urinib ko'ring.");
            }
            throw new Error(`Rasm xatosi: ${errorMsg}`);
        }
    },

    /**
     * Chat oqimini boshlash va davom ettirish
     * @returns {Promise<Object>} Chat session
     */
    async startChat() {
        if (!genAI) {
            throw new Error("API key kiritilmagan. .env.local-ni tekshiring.");
        }

        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: defaultSystemInstruction,
                safetySettings
            });
            const chat = model.startChat({
                history: [],
                generationConfig: {
                    maxOutputTokens: 2048,
                },
            });
            return chat;
        } catch (error) {
            console.error("Chat yaratishda xato:", error);
            throw new Error(`Chat yaratishda xato: ${error.message}`);
        }
    },
};

/**
 * Yordamchi funksiya: Front-enddagi file inputdan kelgan rasmni 
 * Gemini API o'qiydigan Base64 inline formatga o'tkazib beradi.
 * @param {File} file - Rasm fayli
 * @returns {Promise<Object>}
 */
export async function fileToGenerativePart(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result.split(',')[1];
            resolve({
                inlineData: { data: base64Data, mimeType: file.type },
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
