"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BrowserProvider, verifyMessage } from "ethers";

type Step = "idle" | "connecting" | "signing" | "verifying" | "done" | "error";

export default function MetaMaskPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("idle");
  const [address, setAddress] = useState<string>("");
  const [nonce, setNonce] = useState<string>("");
  const [signature, setSignature] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loginTimeStart] = useState<number>(Date.now());

  // ── Step 1: Connect wallet ─────────────────────────────────
  const connectWallet = async () => {
    setError("");

    if (!window.ethereum) {
      setError("MetaMask not detected. Please install the MetaMask browser extension from metamask.io and try again.");
      return;
    }

    try {
      setStep("connecting");

      // This triggers the MetaMask popup — real wallet connection
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const walletAddress = accounts[0];
      setAddress(walletAddress);

      // ── Step 2: Fetch a nonce from our API ─────────────────
      const res = await fetch("/api/nonce");
      const { nonce: freshNonce } = await res.json();
      setNonce(freshNonce);

      setStep("signing");
    } catch (err: any) {
      if (err?.code === 4001) {
        setError("You rejected the connection request. Please try again.");
      } else {
        setError("Connection failed. Make sure MetaMask is unlocked.");
      }
      setStep("idle");
    }
  };

  // ── Step 2: Sign the nonce with the private key ────────────
  const signNonce = async () => {
    setError("");
    try {
      setStep("signing");

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Message the user will see in the MetaMask popup
      const message = `Welcome to AuthStudy!\n\nThis is a research study login.\nYour identity will NOT be stored.\n\nNonce: ${nonce}`;

      // This triggers the MetaMask signature popup — real ECDSA signing
      const sig = await signer.signMessage(message);
      setSignature(sig);

      setStep("verifying");

      // ── Step 3: Verify signature using ethers.js ───────────
      // verifyMessage recovers the signing address from the signature
      // and checks it matches the connected wallet address
      const recovered = verifyMessage(message, sig);
      const verified = recovered.toLowerCase() === address.toLowerCase();

      if (!verified) {
        throw new Error("Signature verification failed — address mismatch.");
      }

      setStep("done");

      // Redirect to success page with login time
      const elapsed = Date.now() - loginTimeStart;
      router.push(`/success?method=metamask&time=${elapsed}&address=${address.slice(0, 10)}...`);
    } catch (err: any) {
      if (err?.code === 4001) {
        setError("You rejected the signature request. Please try again.");
        setStep("signing");
      } else {
        setError(err?.message || "Signing failed. Please try again.");
        setStep("idle");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🦊</div>
          <h1 className="text-2xl font-bold text-gray-900">MetaMask Login</h1>
          <p className="text-sm text-gray-500 mt-1">Blockchain-based identity verification</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { label: "Connect", active: step !== "idle" },
            { label: "Sign", active: step === "signing" || step === "verifying" || step === "done" },
            { label: "Verified", active: step === "done" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                s.active ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
              }`}>
                {i + 1}
              </div>
              <span className={`text-xs ${s.active ? "text-orange-600 font-medium" : "text-gray-400"}`}>
                {s.label}
              </span>
              {i < 2 && <div className={`w-6 h-0.5 ${s.active ? "bg-orange-300" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Main card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          {/* IDLE — connect step */}
          {step === "idle" && (
            <>
              <div className="bg-orange-50 rounded-xl p-4 mb-5 border border-orange-100">
                <p className="text-sm font-semibold text-orange-800 mb-2">What will happen:</p>
                <ol className="text-sm text-orange-700 space-y-1 list-decimal list-inside">
                  <li>MetaMask will ask you to connect your wallet</li>
                  <li>We generate a one-time challenge (nonce)</li>
                  <li>MetaMask asks you to sign it with your private key</li>
                  <li>We verify the signature — no data is stored</li>
                </ol>
              </div>

              <div className="bg-blue-50 rounded-xl p-3 mb-5 border border-blue-100">
                <p className="text-xs text-blue-700">
                  🔒 <strong>Privacy note:</strong> Your wallet address and signature are only used for this session. Nothing is saved to any server or database.
                </p>
              </div>

              <button
                onClick={connectWallet}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Connect MetaMask Wallet
              </button>
            </>
          )}

          {/* CONNECTING */}
          {step === "connecting" && (
            <div className="text-center py-6">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Opening MetaMask...</p>
              <p className="text-gray-400 text-sm mt-1">Check your browser extension</p>
            </div>
          )}

          {/* SIGNING — wallet connected, show nonce, ask to sign */}
          {step === "signing" && (
            <>
              <div className="bg-green-50 rounded-xl p-3 mb-4 border border-green-100 flex items-center gap-3">
                <span className="text-green-600 text-lg">✓</span>
                <div>
                  <p className="text-sm font-semibold text-green-800">Wallet connected</p>
                  <p className="text-xs text-green-600 font-mono truncate">{address}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Challenge Nonce (one-time)
                </p>
                <p className="text-xs font-mono text-gray-700 break-all">{nonce}</p>
              </div>

              <div className="bg-amber-50 rounded-xl p-3 mb-5 border border-amber-100">
                <p className="text-xs text-amber-700">
                  ⚠️ MetaMask will open a <strong>signature request</strong>. This is NOT a transaction — it costs no gas fees and moves no funds.
                </p>
              </div>

              <button
                onClick={signNonce}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Sign with Wallet →
              </button>
            </>
          )}

          {/* VERIFYING */}
          {step === "verifying" && (
            <div className="text-center py-6">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-700 font-medium">Verifying signature...</p>
              <p className="text-gray-400 text-sm mt-1">Running ECDSA recovery</p>
            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-700">{error}</p>
              {step === "idle" && (
                <button
                  onClick={connectWallet}
                  className="mt-3 w-full py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          )}
        </div>

        {/* Technical info box */}
        <div className="mt-4 bg-slate-800 rounded-xl p-4">
          <p className="text-xs text-slate-400 font-semibold mb-2 uppercase tracking-wider">
            Technical details
          </p>
          <div className="space-y-1 text-xs text-slate-300 font-mono">
            <p>Algorithm: ECDSA (secp256k1)</p>
            <p>Hash function: Keccak-256</p>
            <p>Verification: ethers.js verifyMessage()</p>
            <p>Storage: None</p>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="mt-4 w-full text-center text-sm text-slate-400 hover:text-white transition-colors"
        >
          ← Back to home
        </button>
      </div>
    </div>
  );
}
