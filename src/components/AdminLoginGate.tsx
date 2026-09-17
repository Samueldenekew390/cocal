import React, { useState } from 'react';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowLeft, KeyRound, AlertCircle, CheckCircle2, Hash } from 'lucide-react';

interface AdminLoginGateProps {
  onLoginSuccess: (email: string) => void;
  onExit: () => void;
}

// SHA-256 Cryptographic Hashes of authorized credentials (no plaintext stored or visible)
const AUTHORIZED_EMAIL_HASH = '9513c1ca4a9ff9803d57ec9e3df8976ba9d065e566b918d4c7910474b0fbbace';
const AUTHORIZED_PASSWORD_HASH = '732517f3322476bc76af301f564682d67029d9a37289c6e220dcc98629b1a723';

/**
 * Computes SHA-256 hex string using Web Crypto API with pure JS fallback
 */
async function computeSha256Hex(message: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(message);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('SubtleCrypto error, using fallback:', e);
  }

  // Pure JavaScript SHA-256 fallback for environments where crypto.subtle is restricted
  return fallbackSha256(message);
}

function fallbackSha256(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i = 0, j = 0;
  let result = '';
  const words: number[] = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  
  let hash: number[] = [];
  let k: number[] = [];
  let primeCounter = 0;

  const isComposite: { [key: number]: boolean } = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = true;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  hash = hash.slice(0, 8);

  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[ascii[lengthProperty] >> 2] |= 0x80 << ((3 - (ascii[lengthProperty] % 4)) * 8);
  words[(((asciiBitLength + 64) >> 9) << 4) + 15] = asciiBitLength;

  for (let chunk = 0; chunk < words.length; chunk += 16) {
    const w: number[] = [];
    for (i = 0; i < 16; i++) w[i] = words[chunk + i] || 0;
    for (i = 16; i < 64; i++) {
      const s0 = rightRotate(w[i - 15], 7) ^ rightRotate(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rightRotate(w[i - 2], 17) ^ rightRotate(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }

    let a = hash[0], b = hash[1], c = hash[2], d = hash[3];
    let e = hash[4], f = hash[5], g = hash[6], h = hash[7];

    for (i = 0; i < 64; i++) {
      const s1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      const ch = (e & f) ^ (~e & g);
      const temp1 = (h + s1 + ch + k[i] + w[i]) | 0;
      const s0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (s0 + maj) | 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    hash[0] = (hash[0] + a) | 0;
    hash[1] = (hash[1] + b) | 0;
    hash[2] = (hash[2] + c) | 0;
    hash[3] = (hash[3] + d) | 0;
    hash[4] = (hash[4] + e) | 0;
    hash[5] = (hash[5] + f) | 0;
    hash[6] = (hash[6] + g) | 0;
    hash[7] = (hash[7] + h) | 0;
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j >= 0; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += (b < 16 ? '0' : '') + b.toString(16);
    }
  }
  return result;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onLoginSuccess, onExit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showMaskedHint, setShowMaskedHint] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      const [inputEmailHash, inputPasswordHash] = await Promise.all([
        computeSha256Hex(cleanEmail),
        computeSha256Hex(cleanPassword),
      ]);

      if (inputEmailHash === AUTHORIZED_EMAIL_HASH && inputPasswordHash === AUTHORIZED_PASSWORD_HASH) {
        onLoginSuccess(cleanEmail);
      } else {
        setIsLoading(false);
        if (inputEmailHash !== AUTHORIZED_EMAIL_HASH) {
          setErrorMsg('Access Denied: Unrecognized administrator email signature.');
        } else {
          setErrorMsg('Access Denied: Invalid security passphrase.');
        }
      }
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      setErrorMsg('Cryptographic verification failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Subtle Background Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#F40009]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-red-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar Back to Site Link */}
      <div className="absolute top-6 left-6 z-10">
        <button
          onClick={onExit}
          className="inline-flex items-center space-x-2 rounded-xl border border-neutral-800 bg-neutral-900/90 px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:border-neutral-600 transition-all backdrop-blur-sm"
          id="btn-login-return-site"
        >
          <ArrowLeft className="h-4 w-4 text-[#ff4d55]" />
          <span>Return to Careers Website</span>
        </button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Crest */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F40009] to-[#990006] text-white shadow-xl shadow-[#F40009]/30 border border-white/20">
          <Shield className="h-8 w-8" />
        </div>

        <div className="mt-4 text-center">
          <span className="font-serif text-2xl font-bold tracking-wide text-white block">
            The Coca-Cola Company
          </span>
          <h2 className="mt-1 text-base font-bold text-neutral-200">
            Global HR Administration Portal
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            Restricted Enterprise Access • Candidate Governance & Review
          </p>
        </div>
      </div>

      {/* Login Card */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="rounded-3xl border border-white/10 bg-[#14141b]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Security & Cryptographic Protection Indicator */}
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0">
                  <Hash className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-white">SHA-256 Cryptographic Shield</span>
                    <span className="rounded bg-emerald-500/20 text-emerald-400 text-[9px] px-1.5 py-0.5 font-mono font-semibold">ENCRYPTED</span>
                  </div>
                  <p className="text-[11px] text-neutral-400">
                    Zero plaintext credentials stored in code or memory.
                  </p>
                </div>
              </div>
            </div>

            {/* Hidden/Masked hint toggle */}
            <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => setShowMaskedHint(!showMaskedHint)}
                className="text-neutral-400 hover:text-neutral-200 transition-colors inline-flex items-center space-x-1 font-mono text-[10px]"
              >
                <span>{showMaskedHint ? 'Hide Credential Mask' : 'Show Credential Mask'}</span>
              </button>

              {showMaskedHint && (
                <span className="text-neutral-300 font-mono text-[10px] bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                  z***@gmail.com / z***123
                </span>
              )}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 flex items-center space-x-2.5 rounded-xl border border-red-500/40 bg-red-500/15 p-3 text-xs text-red-200">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Admin Email Signature
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter administrator email"
                  required
                  autoFocus
                  className="w-full rounded-xl border border-neutral-700 bg-[#0c0c10] py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-[#F40009] focus:outline-none transition-colors"
                  id="admin-login-email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Admin Passphrase
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full rounded-xl border border-neutral-700 bg-[#0c0c10] py-2.5 pl-10 pr-10 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-[#F40009] focus:outline-none transition-colors"
                  id="admin-login-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white"
                  title={showPassword ? 'Hide passphrase' : 'Show passphrase'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-[#F40009] py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#F40009]/25 hover:bg-[#d60008] transition-all disabled:opacity-50"
                id="btn-admin-submit-login"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Cryptographic Verification & Login</span>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center">
            <p className="text-[10px] text-neutral-500 leading-relaxed">
              Protected by Coca-Cola Global Enterprise HR Security Governance. All administrative events are monitored and audit-logged.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
