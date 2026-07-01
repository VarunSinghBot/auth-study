"use client";

import Link from "next/link";
import { useSearchParams, Suspense } from "react";

function ErrorContent() {
  const params = useSearchParams();
  const error = params.get("error");

  const messages: Record<string, string> = {
    OAuthSignin: "Error starting Google sign-in. Please try again.",
    OAuthCallback: "Error completing Google sign-in. Please try again.",
    OAuthAccountNotLinked: "This email is already linked to another account.",
    default: "An authentication error occurred.",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h1 className="text-lg font-bold text-gray-900 mb-2">Login Error</h1>
        <p className="text-sm text-gray-500 mb-6">
          {messages[error ?? "default"] ?? messages.default}
        </p>
        <Link href="/" className="block w-full py-3 bg-slate-800 text-white rounded-xl font-semibold text-sm hover:bg-slate-700 transition-colors">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={null}>
      <ErrorContent />
    </Suspense>
  );
}
