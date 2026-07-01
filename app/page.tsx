import Link from "next/link";
import { GoogleLoginButton } from "@/components/GoogleLoginButton";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full mb-6">
            🎓 MCA Research Study · Varun Singh · CHRIST University
          </span>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
            Auth Method Study
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">
            Please try <strong className="text-white">both</strong> login methods below
            and complete a short survey after each one.
          </p>
        </div>

        {/* Login cards */}
        <div className="space-y-4">

          {/* Google OAuth */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <GoogleIcon />
              </div>
              <div>
                <p className="font-bold text-gray-900">Login with Google</p>
                <p className="text-xs text-gray-400 mt-0.5">OAuth 2.0 · Centralized · Password-based identity</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {["Familiar", "Centralized", "Data stored by Google"].map(t => (
                <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            {/* Real NextAuth Google sign-in */}
            <GoogleLoginButton />
          </div>

          {/* MetaMask */}
          <Link
            href="/auth/metamask"
            className="block bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
                🦊
              </div>
              <div>
                <p className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors">
                  Login with MetaMask
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Web3 · Decentralized · Cryptographic signature</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {["No password", "Decentralized", "Zero data stored"].map(t => (
                <span key={t} className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <div className="w-full py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold text-center group-hover:bg-orange-600 transition-colors">
              Connect Wallet →
            </div>
          </Link>

        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          No personal data is stored by this application.
        </p>
      </div>
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-6 h-6">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.32-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
      <path fill="#FBBC05" d="M11.68 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.68-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.34-5.7z"/>
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.34 5.7c1.74-5.2 6.59-9.07 12.32-9.07z"/>
    </svg>
  );
}
