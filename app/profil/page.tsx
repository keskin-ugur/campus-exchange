import { db } from "../lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { logout } from "../actions";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import DeleteButton from "../DeleteButton";

export default async function ProfilPage() {
  // 1. Çerezden Kullanıcı Adını Al (Next.js 15 await kuralı)
  const cookieStore = await cookies();
  // ARTIK BURADAN USERNAME GELİYOR
  const username = cookieStore.get("session_user")?.value;

  // Giriş yapmamışsa login'e at
  if (!username) redirect("/login");

  // 2. Kullanıcıyı USERNAME ile bul
  const user = await db.user.findUnique({
    where: { username: username }, // Email yerine username sorgusu
    include: {
      notes: {
        orderBy: { createdAt: "desc" }
      }
    }
  });

  // Eğer veritabanında bulamazsa (nadir durum) login'e at
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        {/* --- ÜST BİLGİ KARTI --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-6 rounded-lg shadow border-l-4 border-blue-500 gap-4">

          {/* Sol: Kullanıcı Bilgileri */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">@{user.username}</h1>
            <p className="text-sm text-gray-400 mt-1">{user.email}</p>
          </div>

          {/* Orta: PUAN GÖSTERGESİ 🏆 */}
          <div className="text-center bg-blue-50 px-8 py-3 rounded-xl border border-blue-100 shadow-sm min-w-[150px]">
            <span className="block text-3xl font-extrabold text-blue-600">{user.points}</span>
            <span className="text-xs text-blue-400 font-bold uppercase tracking-wider">Puan</span>
          </div>

          {/* Sağ: Butonlar */}
          <div className="flex gap-3">
            <a href="/" className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded font-medium transition bg-white border border-blue-100">
              🏠 Anasayfa
            </a>
            <form action={logout}>
              <button className="px-4 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 font-medium transition border border-red-100">
                Çıkış Yap
              </button>
            </form>
          </div>
        </div>

        {/* --- NOTLAR LİSTESİ --- */}
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-gray-700">Paylaşımların</h2>
          <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full font-medium">
            {user.notes.length} Adet
          </span>
        </div>

        <div className="space-y-4">
          {user.notes.map((note) => {
            // Doğrulama durumuna göre badge rengi ve metni
            const getBadge = () => {
              if (note.verificationStatus === "APPROVED") {
                return { emoji: "✅", text: "Onaylandı", className: "bg-green-100 text-green-700 border-green-300" };
              } else if (note.verificationStatus === "REJECTED") {
                return { emoji: "❌", text: "Reddedildi", className: "bg-red-100 text-red-700 border-red-300" };
              } else {
                return { emoji: "🟡", text: "Beklemede", className: "bg-yellow-100 text-yellow-700 border-yellow-300" };
              }
            };

            const badge = getBadge();

            return (
              <div key={note.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">

                {/* Doğrulama Durumu Badge'i */}
                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border mb-3 ${badge.className}`}>
                  <span>{badge.emoji}</span>
                  <span>{badge.text}</span>
                </div>

                <div className="flex justify-between items-start">
                  {/* Not İçeriği */}
                  <div className="flex-1 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-800">{note.title}</h3>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded border border-blue-100 font-semibold">
                        {note.course || "Genel"}
                      </span>
                    </div>

                    <p className="text-gray-600 line-clamp-2 mb-3">{note.content}</p>

                    {/* Red Nedeni (varsa) */}
                    {note.verificationStatus === "REJECTED" && note.rejectionReason && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-3 mb-3">
                        <p className="text-sm text-red-800">
                          <span className="font-bold">Red Nedeni:</span> {note.rejectionReason}
                        </p>
                      </div>
                    )}

                    <div className="text-xs text-gray-400 flex items-center gap-1">
                      🕒 {formatDistanceToNow(note.createdAt, { addSuffix: true, locale: tr })}
                    </div>
                  </div>

                  {/* Akıllı Silme Butonu (-10 Puan Uyarılı) - sadece onaylananlar için */}
                  {note.verificationStatus === "APPROVED" && <DeleteButton noteId={note.id} />}
                </div>
              </div>
            );
          })}

          {/* ... üst kısımlar aynı ... */}

          {/* Eğer hiç not yoksa */}
          {user.notes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-500 text-lg mb-2">Henüz hiç not paylaşmamışsın.</p>
              <p className="text-gray-400 text-sm mb-4">Hemen bir not paylaş ve <span className="text-blue-500 font-bold">+10 Puan</span> kazan!</p>

              <a href="/?yeni=true" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-bold">
                Not Paylaş
              </a>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}