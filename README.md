# 🎓 Campus Exchange - Öğrenci Kaynak Paylaşım Platformu

![Project Status](https://img.shields.io/badge/status-live-success?style=flat&color=2ea44f)
![Framework](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)
![Database](https://img.shields.io/badge/PostgreSQL-Prisma-blue?style=flat&logo=postgresql)
![AI Power](https://img.shields.io/badge/AI-Google%20Gemini-8E75B2?style=flat&logo=googlebard)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

**Campus Exchange**, akademik bilgi paylaşımını dijitalleştiren ve **Yapay Zeka (AI)** ile denetleyerek kaliteyi artıran modern bir web platformudur.

Yönetim Bilişim Sistemleri (YBS) vizyonuyla geliştirilen bu proje, öğrencilerin ihtiyaçlarına teknolojik çözümler sunmayı hedefler.

🔗 **Canlı Demo:** [CampusExchange](https://campusexchanges.netlify.app)

---

## 🚀 Proje Hakkında

Bu platform önemli bir soruna çözüm üretmek için tasarlanmıştır:

**Nitelikli Bilgi Paylaşımı (AI Destekli Notlar):** Öğrencilerin ders notlarını paylaştığı, içeriklerin ise **Google Gemini AI** tarafından otomatik olarak analiz edilip onaylandığı akıllı bir kaynak havuzu.

---

## ✨ Temel Özellikler

* **⚡ Next.js App Router:** React'in en güncel mimarisi ile yüksek performanslı, Server-Side Rendering (SSR) destekli yapı.
* **🤖 AI Tabanlı İçerik Denetimi:** Yüklenen ders notları, Google Gemini API'a gönderilir. Sistem, içeriğin gerçekten bir ders notu olup olmadığını semantik olarak analiz eder. "Sohbet dili" içeren değersiz içerikleri otomatik reddeder.
* **🗄️ Güçlü Veritabanı Yapısı:** PostgreSQL ve Prisma ORM kullanılarak ilişkisel veri tabanı yönetimi sağlanmıştır.
* **🔒 Güvenli Veri Akışı:** Next.js Server Actions ve Zod kütüphanesi ile güvenli form validasyonları.
* **🎨 Modern UI/UX:** Tailwind CSS ile geliştirilmiş, mobil uyumlu ve kullanıcı dostu arayüz.

---

## 🛠️ Kullanılan Teknolojiler

| Kategori | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Frontend & Backend** | ![Next.js](https://img.shields.io/badge/-Next.js-000000?style=flat&logo=next.js&logoColor=white) | App Router & Server Components |
| **Dil** | ![TypeScript](https://img.shields.io/badge/-TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) | Tip güvenliği için |
| **Stil** | ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | Hızlı UI tasarımı |
| **Backend & DB** | ![Prisma](https://img.shields.io/badge/-Prisma-2D3748?style=flat&logo=prisma&logoColor=white) | ORM ve Veritabanı Yönetimi |
| **Yapay Zeka** | ![Gemini](https://img.shields.io/badge/-Google_Gemini-8E75B2?style=flat&logo=googlebard&logoColor=white) | İçerik Analizi ve Sınıflandırma |
| **Deploy** | ![Netlify](https://img.shields.io/badge/-Netlify-00C7B7?style=flat&logo=netlify&logoColor=white) | CI/CD ve Hosting |

---

## ⚙️ Kurulum ve Çalıştırma (Local Development)

Projeyi kendi bilgisayarınızda geliştirmek için aşağıdaki adımları takip edebilirsiniz.

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/keskin-ugur/campus-exchange.git
cd campus-exchange
```

### 2. Gerekli Paketleri Yükleyin

```bash
npm install
```

### 3. Çevresel Değişkenleri (.env) Ayarlayın

Projenin ana dizininde `.env` adında bir dosya oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Veritabanı Bağlantı Adresi (Localhost veya Neon/Supabase)
DATABASE_URL="postgresql://kullanici_adi:sifre@localhost:5432/campus_db"

# Google AI Studio'dan alınan API Anahtarı
GOOGLE_API_KEY="AIzaSy_SENIN_API_KEYIN_BURAYA"
```

### 4. Veritabanını Oluşturun

Prisma şemasını veritabanına uygulayın:

```bash
npx prisma db push
```

### 5. Uygulamayı Başlatın

```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine giderek projeyi görüntüleyebilirsiniz.

---

## 🧠 AI Modülü Nasıl Çalışıyor?

Projedeki "Akıllı Not Kontrolü" şu mantıkla işler:

1. Kullanıcı bir metin veya not girer.
2. Metin, Next.js Server Action üzerinden sunucuya gönderilir.
3. Sunucu, metni Google Gemini Pro modeline özel bir "System Prompt" ile iletir.
   - **Prompt:** "Bu metni analiz et, ders notu olup olmadığını JSON formatında `{"isValid": boolean, "reason": string}` olarak döndür."
4. Eğer AI onayı verirse not veritabanına kaydedilir, aksi takdirde kullanıcıya reddedilme sebebi gösterilir.

---

## 🤝 Katkıda Bulunma

Projeye katkıda bulunmak ister iseniz:

1. Bu repoyu Fork'layın.
2. Yeni bir branch oluşturun (`git checkout -b feature/YeniOzellik`).
3. Değişikliklerinizi commit edin.
4. Branch'inizi Push edin ve bir Pull Request (PR) oluşturun.

---

## 📝 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır.
