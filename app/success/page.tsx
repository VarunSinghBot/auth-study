"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";

// ── Replace with your real Google Form URL ────────────────────
// In Google Forms: click "⋮" → "Get pre-filled link" → copy URL
const GOOGLE_FORM_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL
  || "https://forms.google.com/your-form-id";

function SuccessContent() {
  const params = useSearchParams();
  const { data: session } = useSession();
  const method = params.get("method") ?? "oauth";
  const timeMs = parseInt(params.get("time") ?? "0");
  const walletAddress = params.get("address") ?? "";
  const isOAuth = method === "oauth";

  const displayTime = timeMs > 0
    ? `${(timeMs / 1000).toFixed(1)}s`
    : "—";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full space-y-4">

        {/* Success card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            isOAuth ? "bg-green-50" : "bg-orange-50"
          }`}>
            <svg className={`w-8 h-8 ${isOAuth ? "text-green-500" : "text-orange-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {isOAuth ? "Google Login Successful" : "Wallet Verified"}
          </h1>
          <p className="text-gray-500 text-sm mb-5">
            {isOAuth
              ? `Signed in as ${session?.user?.email ?? "..."}`
              : `Wallet: ${walletAddress}`
            }
          </p>

          {/* Method badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5 ${
            isOAuth ? "bg-blue-50 text-blue-700" : "bg-orange-50 text-orange-700"
          }`}>
            {isOAuth ? "🔵 OAuth 2.0 — JWT Session" : "🦊 Web3 — ECDSA Signature"}
          </div>

          {/* What was used - technical summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left border border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              What just happened
            </p>
            {isOAuth ? (
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex gap-2"><span className="text-blue-400">→</span> Redirected to Google for authentication</li>
                <li className="flex gap-2"><span className="text-blue-400">→</span> Google issued a signed authorization code</li>
                <li className="flex gap-2"><span className="text-blue-400">→</span> Server exchanged code for ID token (JWT)</li>
                <li className="flex gap-2"><span className="text-blue-400">→</span> Session stored in encrypted cookie (1hr)</li>
                <li className="flex gap-2"><span className="text-blue-400">→</span> Profile data held by Google's servers</li>
              </ul>
            ) : (
              <ul className="text-xs text-gray-600 space-y-1.5">
                <li className="flex gap-2"><span className="text-orange-400">→</span> Wallet connected via window.ethereum API</li>
                <li className="flex gap-2"><span className="text-orange-400">→</span> Server generated a one-time nonce (UUID)</li>
                <li className="flex gap-2"><span className="text-orange-400">→</span> MetaMask signed nonce using secp256k1 ECDSA</li>
                <li className="flex gap-2"><span className="text-orange-400">→</span> ethers.js verified signature → address match</li>
                <li className="flex gap-2"><span className="text-orange-400">→</span> No data stored — session ends when you leave</li>
              </ul>
            )}
          </div>

          {/* Login time */}
          {timeMs > 0 && (
            <div className="bg-slate-50 rounded-xl p-3 mb-5 border border-slate-100">
              <p className="text-xs text-slate-500">End-to-end login time</p>
              <p className="text-2xl font-bold text-slate-800">{displayTime}</p>
            </div>
          )}

          {/* CTA to Google Form */}
          <a
            href={GOOGLE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full py-3 rounded-xl font-semibold text-white text-sm transition-colors ${
              isOAuth ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            Fill in the Usability Survey →
          </a>
          <p className="text-xs text-gray-400 mt-2">Opens Google Forms in a new tab</p>
        </div>

        {/* Try other method */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 text-center">
          <p className="text-sm text-gray-600 mb-3">
            {isOAuth
              ? "Now please try the MetaMask login too"
              : "Now please try the Google login too"}
          </p>
          <Link
            href={isOAuth ? "/auth/metamask" : "/"}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
          >
            {isOAuth ? "🦊 Try MetaMask Login →" : "🔵 Try Google Login →"}
          </Link>
        </div>

        {/* Sign out (OAuth only) */}
        {isOAuth && session && (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors py-2"
          >
            Sign out from Google
          </button>
        )}

        <Link href="/" className="block text-center text-xs text-gray-400 hover:text-gray-600 transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
