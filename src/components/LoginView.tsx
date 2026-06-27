'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function LoginView() {
  const { loginWithEmail } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginWithEmail(email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate user.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative select-none">
      {/* Background aesthetics */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 p-8 md:p-10 shadow-2xl relative z-10 flex flex-col gap-8">
        <div className="text-center flex flex-col gap-2">
          <div className="flex justify-center mb-2">
            <div className="w-10 h-10 border border-neutral-700 flex items-center justify-center bg-neutral-950 text-white">
              <Shield className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
          <h2 className="font-sans font-bold text-lg tracking-widest text-white uppercase">
            ADMIN GATEKEEPER
          </h2>
          <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
            Authorize credentials to access administrative dashboard
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/20 border border-rose-500/20 p-4 flex gap-3 text-xs text-rose-400 font-mono uppercase">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
              EMAIL ADDRESS
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-600" />
              <input
                type="email"
                placeholder="ENTER REGISTERED EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-xs font-semibold tracking-wider text-white bg-neutral-950 border border-neutral-800 focus:border-neutral-500 pl-11 pr-4 py-3.5 outline-hidden rounded-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-neutral-600" />
              <input
                type="password"
                placeholder="ENTER SECURE ACCESS TOKEN"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full text-xs font-semibold tracking-wider text-white bg-neutral-950 border border-neutral-800 focus:border-neutral-500 pl-11 pr-4 py-3.5 outline-hidden rounded-none"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                VERIFYING CAPABILITIES...
              </span>
            ) : (
              'ENTER PANEL'
            )}
          </Button>
        </form>

        <div className="border-t border-neutral-800 pt-6 flex justify-between items-center text-[9px] font-mono text-neutral-600 uppercase tracking-widest">
          <span>PORT: 3000 // SSL ACTIVE</span>
          <button
            type="button"
            onClick={() => router.push('/')}
            className="hover:text-white transition-colors"
          >
            RETURN HOME
          </button>
        </div>
      </div>
    </div>
  );
}
