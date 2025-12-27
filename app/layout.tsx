import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campus Exchange",
  description: "Notlarını paylaş, puan kazan!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        {/* ANA İÇERİK */}
        <div className="flex-1">
          {children}
        </div>

        {/* --- FOOTER (ALT BİLGİ) --- */}
        <footer className="w-full py-6 text-center border-t border-gray-200 bg-white/50 backdrop-blur-sm mt-auto">
          <div className="flex flex-col items-center justify-center gap-2">
            
            {/* Geliştirici İmzası (GÜNCELLENDİ) */}
            <p className="text-sm text-gray-500 font-medium flex items-center gap-1">
              Developed with 
              <span className="text-lg">☕</span> 
              & 
              <span className="text-lg">💻</span> 
              by 
              <span className="text-gray-900 font-bold hover:text-blue-600 transition cursor-default">
                Uğur KESKİN
              </span>
            </p>

            {/* GitHub Linki */}
            <a 
              href="https://github.com/keskin-ugur/campus-exchange" // Burayı kendi GitHub linkinle değiştirmeyi unutma
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-black transition flex items-center gap-1 border border-gray-200 px-3 py-1 rounded-full hover:border-black bg-white"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Star on GitHub
            </a>

          </div>
        </footer>
      </body>
    </html>
  );
}