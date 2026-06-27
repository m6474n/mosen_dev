'use client';

import React, { useState } from 'react';
import { Inter, Inter_Tight } from 'next/font/google';
import { ReactLenis } from 'lenis/react';
import { AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';
import { DataProvider } from '@/context/DataContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomPointer from '@/components/CustomPointer';
import InitialPreloader from '@/components/InitialPreloader';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['200', '300', '400'],
  variable: '--font-inter-tight',
  display: 'swap',
});

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <body>
        <DataProvider>
          <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
            <CustomPointer />

            <AnimatePresence mode="wait">
              {isLoading && (
                <InitialPreloader key="app-preloader" onComplete={() => setIsLoading(false)} />
              )}
            </AnimatePresence>

            <div
              className={`min-h-screen selection:bg-neutral-950 selection:text-white flex flex-col justify-between ${
                isAdminRoute ? 'bg-neutral-50' : 'bg-white text-neutral-900'
              }`}
            >
              {!isAdminRoute && <Header />}

              <div className="flex-grow flex flex-col">
                <AnimatePresence mode="wait">
                  {!isLoading && (
                    <main className="flex-grow flex flex-col">
                      {children}
                    </main>
                  )}
                </AnimatePresence>
              </div>

              {!isAdminRoute && <Footer />}
            </div>
          </ReactLenis>
        </DataProvider>
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <RootLayoutInner>{children}</RootLayoutInner>;
}
