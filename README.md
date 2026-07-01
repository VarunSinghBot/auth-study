# Auth Study — Next.js

Real OAuth 2.0 + MetaMask login implementation for the MCA research study comparing Web3 wallet authentication with Google OAuth 2.0.

**No database. No user data stored. Privacy-first.**

---

## Stack

- **Next.js 14** (App Router)
- **NextAuth.js v4** — Google OAuth, JWT sessions only
- **ethers.js v6** — MetaMask wallet connection + ECDSA signature verification
- **Tailwind CSS**

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.local.example .env.local
```

### 3. Get Google OAuth credentials

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → **APIs & Services** → **Credentials**
3. Click **Create Credentials** → **OAuth 2.0 Client ID**
4. Application type: **Web application**
5. Add Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Copy **Client ID** and **Client Secret** into `.env.local`

### 4. Generate NextAuth secret

```bash
openssl rand -base64 32
```
Paste the output as `NEXTAUTH_SECRET` in `.env.local`

### 5. Add your Google Form URL

1. Create your SUS survey in Google Forms (10 questions, 1–5 scale)
2. Click **⋮** → **Get pre-filled link**
3. Copy the URL and paste as `NEXT_PUBLIC_GOOGLE_FORM_URL` in `.env.local`

### 6. Run the app

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## How it works

### Google OAuth 2.0 flow

```
User → clicks "Continue with Google"
     → NextAuth redirects to accounts.google.com
     → User selects account + consents
     → Google returns authorization code to /api/auth/callback/google
     → NextAuth exchanges code for ID token (JWT signed by Google)
     → Session stored in encrypted HttpOnly cookie (1 hour)
     → Redirect to /success?method=oauth
```

**Security:** TLS + authorization code flow (PKCE) + signed JWT. Password never touches your server.

### MetaMask / Web3 flow

```
User → clicks "Connect MetaMask Wallet"
     → window.ethereum.request("eth_requestAccounts") → MetaMask popup
     → User approves → wallet address returned
     → GET /api/nonce → server returns random UUID nonce
     → signer.signMessage(nonce) → MetaMask signature popup
     → User approves → ECDSA signature returned
     → ethers.verifyMessage(message, signature) → recovers address
     → If recovered address === wallet address → verified
     → Redirect to /success?method=metamask
```

**Security:** secp256k1 ECDSA. Private key never leaves user's device. No data stored.

---

## Why no database?

This is a usability study — we only need participants to **experience** both login flows and complete a survey. Storing user data would:
- Raise unnecessary privacy concerns
- Require GDPR compliance measures
- Add infrastructure complexity
- Not serve any research purpose

The Google Form handles all survey data collection independently.

---

## MetaMask requirement

Participants need the **MetaMask browser extension** installed:
- Chrome: [chrome.google.com/webstore](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
- Firefox: [addons.mozilla.org](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/)

Participants don't need real ETH — the signature request costs zero gas fees.
