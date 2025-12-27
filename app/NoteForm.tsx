"use client";

import { addNote } from "./actions";
import { useRef, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // YENİ EKLENDİ

export default function NoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false); // YENİ: Doğrulama durumu
  const [validationMessage, setValidationMessage] = useState(""); // YENİ: Mesaj

  // YENİ: URL'i kontrol etmek için gerekli kancalar
  const searchParams = useSearchParams();
  const router = useRouter();

  // YENİ: Sayfa yüklendiğinde URL'de "?yeni=true" var mı diye bak
  useEffect(() => {
    if (searchParams.get("yeni") === "true") {
      setIsOpen(true); // Modalı aç

      // Adres çubuğunu temizle (ki sayfa yenilenince tekrar açılmasın)
      router.replace("/");
    }
  }, [searchParams, router]);

  return (
    <>
      {/* 1. Yuvarlak + Butonu */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full text-3xl shadow-lg hover:bg-blue-700 hover:scale-110 transition flex items-center justify-center z-40"
      >
        +
      </button>

      {/* 2. Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">

          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-200">

            <button
              onClick={() => {
                setIsOpen(false);
                setValidationMessage(""); // Mesajı temizle
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-6 text-gray-800">Yeni Not Paylaş</h3>

            <form
              ref={formRef}
              action={async (formData) => {
                setIsValidating(true);
                setValidationMessage("");

                // En az 2 saniye beklet ki kullanıcı mesajı görsün
                const [result] = await Promise.all([
                  addNote(formData),
                  new Promise(resolve => setTimeout(resolve, 2000))
                ]);

                setIsValidating(false);

                if (result?.error) {
                  // Hata mesajını göster
                  setValidationMessage(result.error);

                  // Eğer kimlik doğrulama hatası değilse, login'e yönlendirme
                  if (!result.rejected) {
                    setTimeout(() => {
                      window.location.href = "/login";
                    }, 1500);
                  }
                  return;
                }

                // Başarılı
                if (result?.success) {
                  setValidationMessage(result.message || "Notunuz başarıyla yayınlandı!");
                  formRef.current?.reset();

                  // Modal'ı 2 saniye sonra kapat
                  setTimeout(() => {
                    setIsOpen(false);
                    setValidationMessage("");
                    window.location.reload(); // Sayfayı yenile
                  }, 2000);
                }
              }}
              className="space-y-4"
            >
              <div className="mb-4">
                <input
                  name="course"
                  type="text"
                  placeholder="Ders Kodu (MAT101)"
                  disabled={isValidating}
                  className="p-3 border rounded-lg w-full text-black focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <input
                name="title"
                type="text"
                placeholder="Not Başlığı"
                required
                disabled={isValidating}
                className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              <textarea
                name="content"
                placeholder="Not içeriği..."
                required
                rows={4}
                disabled={isValidating}
                className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              {/* Doğrulama Mesajı */}
              {validationMessage && (
                <div className={`p-3 rounded-lg text-sm ${validationMessage.includes("onaylandı") || validationMessage.includes("yayınlandı")
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : "bg-red-100 text-red-800 border border-red-300"
                  }`}>
                  {validationMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isValidating}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    İçerik Doğrulanıyor...
                  </>
                ) : (
                  "Yayınla (+10 Puan)"
                )}
              </button>

              {/* Bekleyin mesajı */}
              {isValidating && (
                <div className="text-center mt-3 animate-pulse">
                  <p className="text-blue-600 font-semibold mb-1">
                    Yapay Zeka Doğrulaması Yapılıyor...
                  </p>
                  <p className="text-xs text-gray-500">
                    İçeriğinizin ders notu olup olmadığı kontrol ediliyor, lütfen bekleyin.
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}