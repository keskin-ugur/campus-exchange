"use server";

import { db } from "./lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// --- 1. KAYIT OL (Register) ---
// İstenen: Email + Username + Şifre
export async function register(formData: FormData) {
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basit doğrulama
  if (!username || !email || !password) {
    // Boş alan varsa işlem yapma (İleride hata mesajı ekleriz)
    return;
  }

  // Kullanıcı adı veya email daha önce alınmış mı?
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    // Zaten varsa kayıt etme
    return;
  }

  // Yeni kullanıcı oluştur
  await db.user.create({
    data: {
      username,
      email,
      password,
      points: 0, // Yeni üye hediyesi (0 puan)
    },
  });

  // Kayıt başarılıysa direkt giriş yap ve çerez ver
  const cookieStore = await cookies();
  cookieStore.set("session_user", username, { httpOnly: true, path: "/" });

  redirect("/");
}

// --- 2. GİRİŞ YAP (Login) ---
// İstenen: Username + Şifre
export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Kullanıcıyı USERNAME ile bul
  const user = await db.user.findUnique({ where: { username } });

  // Kullanıcı yoksa veya şifre yanlışsa
  if (!user || user.password !== password) {
    return; // Hatalı giriş
  }

  // Giriş başarılı, çerezi yapıştır
  const cookieStore = await cookies();
  cookieStore.set("session_user", user.username, { httpOnly: true, path: "/" });

  redirect("/");
}

// --- 3. ÇIKIŞ YAP ---
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session_user");
  redirect("/login");
}

// --- 4. NOT EKLEME ---
export async function addNote(formData: FormData) {
  const cookieStore = await cookies();
  const username = cookieStore.get("session_user")?.value;

  if (!username) return { error: "Not paylaşmak için giriş yapmalısınız!" };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const course = formData.get("course") as string;

  const user = await db.user.findUnique({ where: { username } });
  if (!user) return { error: "Kullanıcı bulunamadı" };

  // AI DOĞRULAMA: İçeriğin ders notu olup olmadığını kontrol et
  const { validateNote } = await import("./lib/validateNote");
  const validation = await validateNote(title, content, course || undefined);

  if (!validation.isValid) {
    // İçerik ders notu değil - reddedildi
    return {
      error: validation.reason || "Bu içerik ders notu olarak uygun görünmüyor. Lütfen akademik bir içerik paylaşın.",
      rejected: true
    };
  }

  // İçerik onaylandı - veritabanına kaydet
  await db.note.create({
    data: {
      title,
      content,
      course,
      authorId: user.id,
      // Doğrulama alanları
      verificationStatus: "APPROVED",
      isVerified: true,
      verifiedAt: new Date(),
    },
  });

  // Puan ver (+10)
  await db.user.update({
    where: { username },
    data: { points: { increment: 10 } },
  });

  revalidatePath("/");
  revalidatePath("/profil");
  return { success: true, message: "Ders notunuz onaylandı ve yayınlandı! +10 puan kazandınız." };
}

// --- 5. NOT SİLME ---
export async function deleteNote(noteId: string) {
  const cookieStore = await cookies();
  const username = cookieStore.get("session_user")?.value;
  if (!username) return { error: "Giriş yapmalısınız" };

  const user = await db.user.findUnique({ where: { username } });
  if (!user) return { error: "Kullanıcı bulunamadı" };

  const note = await db.note.findUnique({ where: { id: noteId }, include: { author: true } });
  if (!note || note.author.username !== username) return { error: "Yetkisiz işlem" };

  if (user.points < 10) return { error: "Puan yetersiz (-10 Puan gerekli)" };

  await db.$transaction([
    db.note.delete({ where: { id: noteId } }),
    db.user.update({
      where: { id: user.id },
      data: { points: { decrement: 10 } },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/profil");
  return { success: true };
}

// --- 6. SATIN ALMA ---
export async function buyNote(noteId: string) {
  const cookieStore = await cookies();
  const username = cookieStore.get("session_user")?.value;
  if (!username) return { error: "Giriş yapmalısınız" };

  const user = await db.user.findUnique({ where: { username } });
  if (!user) return { error: "Kullanıcı bulunamadı" };

  const note = await db.note.findUnique({ where: { id: noteId } });
  if (!note) return { error: "Not yok" };

  if (note.authorId === user.id) return { success: true };

  const existing = await db.purchase.findUnique({
    where: { userId_noteId: { userId: user.id, noteId } },
  });
  if (existing) return { success: true };

  if (user.points < 10) return { error: "Yetersiz Puan" };

  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { points: { decrement: 10 } } }),
    db.purchase.create({ data: { userId: user.id, noteId } }),
  ]);

  revalidatePath("/");
  return { success: true };
}