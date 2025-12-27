/**
 * Ders Notu Doğrulama Servisi
 * Google Gemini API kullanarak içeriğin ders notu olup olmadığını kontrol eder
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

// API key kontrolü
if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY environment variable is not set!");
    throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface ValidationResult {
    isValid: boolean;
    reason?: string;
}

/**
 * Verilen içeriğin ders notu olup olmadığını AI ile doğrular
 * @param title - Not başlığı
 * @param content - Not içeriği
 * @param course - Ders kodu (opsiyonel)
 * @returns ValidationResult - Doğrulama sonucu ve red nedeni (varsa)
 */
export async function validateNote(
    title: string,
    content: string,
    course?: string
): Promise<ValidationResult> {
    try {
        console.log("🔍 Validating note:", { title, course, contentLength: content.length });

        // Gemini Flash modelini kullan
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const prompt = `Sen bir ders notu doğrulama asistanısın. Sana verilen içeriğin gerçek bir ders notu olup olmadığını değerlendirmelisin.

BAŞLIK: ${title}
${course ? `DERS KODU: ${course}` : ""}
İÇERİK: ${content}

DOĞRULAMA KRİTERLERİ:
1. İçerik eğitim/akademik amaçlı mı?
2. Ders notuna özgü terimler, kavramlar, formüller içeriyor mu?
3. Yeterli detay ve bilgi var mı? (En az 50 karakter)
4. Spam, genel sohbet veya alakasız içerik değil mi?
5. Öğretici/bilgilendirici bir ton var mı?

CEVAP FORMATI (sadece JSON döndür):
{
  "isValid": true/false,
  "reason": "kısa açıklama (sadece red ediliyorsa)"
}

ÖRNEKLER:
✅ UYGUN: "Calculus I - Türev Kuralları: (f+g)' = f' + g', (fg)' = f'g + fg'..."
✅ UYGUN: "Fizik 101: Newton'un 2. yasası F=ma şeklinde ifade edilir..."
❌ UYGUN DEĞİL: "Merhaba arkadaşlar bugün nasılsınız?"
❌ UYGUN DEĞİL: "Satılık araba, temiz bakımlı..."

ŞİMDİ DEĞERLENDİR:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ AI yanıtı alındı:", text.substring(0, 200));

        // JSON parse et
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.error("❌ AI yanıtı JSON formatında değil:", text);
            // Güvenli tarafta kalalım - doğrulama başarısız
            return {
                isValid: false,
                reason: "İçerik doğrulanamadı. Lütfen daha detaylı ve akademik bir not paylaşın.",
            };
        }

        const parsed = JSON.parse(jsonMatch[0]);
        console.log("📊 Validation result:", parsed);

        return {
            isValid: parsed.isValid === true,
            reason: parsed.reason || undefined,
        };
    } catch (error) {
        console.error("❌ Doğrulama hatası:", error);
        console.error("Error details:", {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });

        // Hata durumunda kullanıcıya yardımcı ol
        return {
            isValid: false,
            reason: "Doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.",
        };
    }
}

