"use client";

import { deleteNote } from "./actions";
import { useState } from "react";

export default function DeleteButton({ noteId }: { noteId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // Kullanıcıya soralım
    if (!confirm("Bu notu silmek istiyor musun? Hesabından 10 Puan düşülecek!")) return;

    setLoading(true);
    const result = await deleteNote(noteId); // Server action'ı çağır
    setLoading(false);

    // Eğer hata döndüyse (örn: puan yetersizse) ekrana bas
    if (result?.error) {
      alert(result.error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-white border border-red-200 hover:bg-red-500 font-bold text-xs px-3 py-1.5 rounded transition duration-200 disabled:opacity-50 flex items-center gap-1"
    >
      {loading ? "Siliniyor..." : (
        <>
          <span>🗑️ Sil</span>
          <span className="text-[10px] opacity-70">(-10P)</span>
        </>
      )}
    </button>
  );
}