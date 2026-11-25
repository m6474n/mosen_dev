'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import AdminDashboardView from '@/components/AdminDashboardView';
import { Activity } from 'lucide-react';

interface AdminPageProps {
  defaultSection?: 'dashboard' | 'projects' | 'blogs' | 'resources' | 'leads';
}

export default function AdminPage({ defaultSection = 'dashboard' }: AdminPageProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
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

  if (!user) {
    return null;
  }

  return <AdminDashboardView initialSection={defaultSection} />;
}
