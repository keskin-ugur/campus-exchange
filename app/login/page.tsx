import { login } from "../actions";

export default function LoginPage() {
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
        <h1 className="text-2xl font-bold mb-6 text-blue-600">Tekrar Hoşgeldin 👋</h1>

        <form action={login} className="space-y-4">
          {/* 1. KULLANICI ADI (Email değil!) */}
          <input
            name="username"
            type="text"
            placeholder="Kullanıcı Adın"
            required
            className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {/* 2. ŞİFRE */}
          <input
            name="password"
            type="password"
            placeholder="Şifren"
            required
            className="w-full p-3 border rounded-lg text-black focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Giriş Yap
          </button>
        </form>

        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-600">Hesabın yok mu?</p>
          <a href="/register" className="text-blue-600 font-bold hover:underline">Hemen Kayıt Ol</a>
        </div>
      </div>
    </div>
  );
}