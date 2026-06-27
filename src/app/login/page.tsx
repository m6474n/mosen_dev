'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LoginView from '@/components/LoginView';
import { Activity } from 'lucide-react';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace('/admin');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-neutral-950 text-white font-mono text-xs">
        <Activity className="w-6 h-6 animate-spin text-neutral-400" />
        <span>AUTHENTICATING SECURE HANDSHAKE...</span>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <LoginView />;
}
