import { db } from "./lib/db";
import { cookies } from "next/headers";
// YENİ: Resim bileşenini import ettik
import Image from "next/image";
import NoteForm from "./NoteForm";
import CourseFilter from "./CourseFilter";
import NoteCard from "./NoteCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // 1. Çerezleri kontrol et
  const cookieStore = await cookies();
  const username = cookieStore.get("session_user")?.value;

  // Şu anki kullanıcının ID'sini ve Puanını bulalım
  let currentUser = null;
  if (username) {
    currentUser = await db.user.findUnique({
      where: { username: username },
      select: { id: true, points: true }
    });
  }

  // 2. URL'den filtreyi oku
  const params = await searchParams;
  const selectedCourse = typeof params.ders === "string" ? params.ders : undefined;

  // 3. Filtre butonları için ders listesini çek
  const distinctCourses = await db.note.findMany({
    select: { course: true },
    where: { course: { not: "" } },
    distinct: ["course"],
  });

  const courseList = distinctCourses
    .map((c) => c.course)
    .filter((c): c is string => c !== null);

  // 4. Notları Getir (sadece onaylanmış notlar)
  const notes = await db.note.findMany({
    where: {
      isVerified: true, // Sadece onaylanmış notları göster
      ...(selectedCourse ? { course: selectedCourse } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      author: true,
      purchases: true
    },
  });

  return (
    <main className="flex min-h-screen flex-col items-center px-6 pb-10 bg-gray-100 relative">

      {/* --- SOL ÜST KÖŞE (Giriş/Profil) --- */}
      <div className="absolute top-5 left-5 z-10">
        {username ? (
          <a href="/profil" className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow transition border border-gray-100">
            👤 Profilim <span className="text-xs text-gray-400">(@{username})</span>
          </a>
        ) : (
          <a href="/login" className="text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-2 px-6 py-2 rounded-full shadow-md hover:shadow-lg transition">
            🔑 Giriş Yap
          </a>
        )}
      </div>

      {/* Sağ Üst: Puan Bilgisi */}
      {currentUser && (
        <div className="absolute top-5 right-5 z-10 bg-white px-4 py-2 rounded-full shadow-md border border-blue-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <span className="text-sm text-gray-500 font-medium">Puanın:</span>
          <span className="text-lg font-bold text-blue-600">{currentUser.points}</span>
        </div>
      )}

      {/* --- LOGO ALANI (ESKİ H1 YERİNE) --- */}
      <div className="relative w-[400px] h-[120px] shrink-0 mt-2">
        <Image
          src="/other/logo.svg"
          alt="Campus Exchange Logo"
          fill
          className="object-contain"
          priority={true}
        />
      </div>

      {/* Not Ekleme Formu */}
      <NoteForm />

      <div className="w-full max-w-2xl">
        <CourseFilter courses={courseList} />

        <div className="space-y-4">
          {notes.map((note) => {
            const hasPurchased = currentUser
              ? note.purchases.some(p => p.userId === currentUser.id)
              : false;

            return (
              <NoteCard
                key={note.id}
                note={note}
                currentUsername={username}
                hasPurchased={hasPurchased}
              />
            );
          })}

          {notes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
              <p className="text-gray-500 text-lg">
                {selectedCourse ? `"${selectedCourse}" dersine ait not yok.` : "Henüz hiç not paylaşılmamış."}
              </p>
              {selectedCourse && (
                <a href="/" className="text-blue-500 hover:underline text-sm mt-2 block font-medium">
                  Tüm notları göster
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}