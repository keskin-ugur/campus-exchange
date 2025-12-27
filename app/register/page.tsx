import { register } from "../actions";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      {/* Ana Sayfa Butonu */}
      <a
        href="/"
        className="absolute top-5 left-5 text-sm font-medium text-gray-600 hover:text-blue-600 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow transition border border-gray-100 flex items-center gap-2"
      >
        🏠 Ana Sayfa
      </a>

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2 text-blue-600">Aramıza Katıl 🚀</h1>
        <p className="text-gray-500 mb-6">3 adımda hesabını oluştur.</p>

        <form action={register} className="space-y-4">
          {/* 1. KULLANICI ADI */}
          <input
            name="username"
            type="text"
            placeholder="Kullanıcı Adı Seç"
            required
            className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {/* 2. EMAIL */}
          <input
            name="email"
            type="email"
            placeholder="Okul Mail Adresin"
            required
            className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {/* 3. ŞİFRE */}
          <input
            name="password"
            type="password"
            placeholder="Şifre Belirle"
            required
            className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Kayıt Ol
          </button>
        </form>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-600">Zaten hesabın var mı?</p>
          <a href="/login" className="text-blue-600 font-bold hover:underline">Giriş Yap</a>
        </div>
      </div>
    </div>
  );
}