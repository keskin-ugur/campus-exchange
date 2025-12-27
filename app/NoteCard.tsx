"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { buyNote } from "./actions";
import { useRouter } from "next/navigation"; // YENİ: Yönlendirme kancası

interface NoteCardProps {
  note: any;
  currentUsername?: string;
  hasPurchased: boolean;
}

export default function NoteCard({ note, currentUsername, hasPurchased }: NoteCardProps) {
  const [isUnlocked, setIsUnlocked] = useState(hasPurchased);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // YENİ: Router'ı çalıştır
  
  // Notun sahibi biz miyiz kontrolü
  const isOwner = note.author.username === currentUsername;
  const canView = isUnlocked || isOwner;

  const handleBuy = async () => {
    // 1. KULLANICI YOKSA LOGİN'E AT (DÜZELTME BURADA)
    if (!currentUsername) {
      router.push("/login"); // Alert yerine buraya yönlendiriyoruz
      return;
    }

    if (!confirm("10 Puan karşılığında bu notu açmak istiyor musun?")) return;

    setLoading(true);
    const result = await buyNote(note.id);
    setLoading(false);

    if (result.error) {
      alert(result.error);
    } else {
      setIsUnlocked(true);
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md transition relative overflow-hidden ${isOwner ? "bg-blue-50 border border-blue-200" : "bg-white hover:shadow-lg"}`}>
      
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-bold text-gray-800">{note.title}</h2>
        <span className="text-xs font-medium text-blue-500 bg-white px-2 py-1 rounded-full border border-blue-100">
          {formatDistanceToNow(new Date(note.createdAt), { addSuffix: true, locale: tr })}
        </span>
      </div>

      {/* --- İÇERİK KISMI --- */}
      <div className="relative mt-2 mb-4">
        <p className={`text-gray-600 whitespace-pre-wrap ${!canView ? "blur-sm select-none" : ""}`}>
          {canView ? note.content : note.content.slice(0, 50) + "... (Devamını görmek için satın al)"}
        </p>

        {/* Satın Alma Kilidi (Overlay) */}
        {!canView && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 z-10">
            <button
              onClick={handleBuy}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105 flex items-center gap-2"
            >
              {loading ? "İşleniyor..." : "🔓 10 Puan ile Aç"}
            </button>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-gray-200/50 text-xs text-gray-400 flex justify-between items-center">
        <span className="bg-gray-100 px-2 py-1 rounded font-semibold text-gray-600">
          {note.course || "Genel"}
        </span>
        <span className={`${isOwner ? "text-blue-600 font-bold bg-blue-100 px-2 py-0.5 rounded" : ""}`}>
          @{note.author.username} {isOwner && "(Sen)"}
        </span>
      </div>
    </div>
  );
}