import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

/**
 * GET /api/nonce
 *
 * Returns a fresh random nonce for MetaMask signature requests.
 * We do NOT store this — verification is done client-side with ethers.js
 * since we only need users to experience the flow, not enforce real auth.
 *
 * In a real production system you would store nonces in a DB/Redis
 * and invalidate them after use to prevent replay attacks.
 */
export async function GET() {
  const nonce = randomUUID();
  return NextResponse.json({ nonce });
}
