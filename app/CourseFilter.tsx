"use client";

import { useRouter, useSearchParams } from "next/navigation";

// Bu bileşen dışarıdan 'dersListesi'ni alacak
export default function CourseFilter({ courses }: { courses: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Şu an URL'de hangi ders seçili? (yoksa null döner)
  const currentFilter = searchParams.get("ders");

  const handleFilter = (course: string | null) => {
    if (course) {
      // Dersi seçince URL'i güncelle: /?ders=MAT101
      router.push(`/?ders=${course}`);
    } else {
      // "Tümü"ne basınca filtreyi temizle: /
      router.push("/");
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      {/* 1. "Tümü" Butonu */}
      <button
        onClick={() => handleFilter(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
          !currentFilter 
            ? "bg-blue-600 text-white shadow-md" 
            : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
        }`}
      >
        Tümü
      </button>

      {/* 2. Mevcut Derslerin Butonları */}
      {courses.map((course) => (
        <button
          key={course}
          onClick={() => handleFilter(course)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            currentFilter === course
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          {course}
        </button>
      ))}
    </div>
  );
}