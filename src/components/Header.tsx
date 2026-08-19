'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Button from './Button';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'ABOUT', href: '/about' },
    { label: 'PROJECTS', href: '/projects' },
    { label: 'BLOG', href: '/blog' },
  ];

  const isActive = (href: string) => {
    if (href === '/projects') {
      return pathname.startsWith('/projects');
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      id="navbar"
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 flex items-center ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-xs'
          : 'bg-white/80 backdrop-blur-xs border-b border-transparent'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link
          href="/"
          className="font-sans font-bold text-lg tracking-wider text-neutral-900 transition-opacity hover:opacity-80"
          id="nav-logo"
        >
          MOSEN<span className="text-neutral-400">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8 list-none">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href} className="relative py-1">
                <Link
                  href={link.href}
                  className={`text-xs font-semibold tracking-wider transition-colors hover:text-neutral-950 ${
                    active ? 'text-neutral-950 font-bold' : 'text-neutral-500'
                  }`}
                  id={`link-${link.label.toLowerCase().replace(' ', '-')}`}
                >
                  {link.label}
                </Link>
                {active && (
                  <motion.div
                    layoutId="desktopNavUnderline"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-neutral-950"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </li>
            );
          })}
          <li>
            <Button
              onClick={() => router.push('/contact')}
              variant="primary"
              className="!px-4 !py-2.5 rounded-none flex items-center gap-1.5 shadow-sm"
              id="cta-book-call"
            >
              BOOK A CALL
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </li>
        </ul>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden p-2 text-neutral-600 hover:text-neutral-950 transition-colors focus:outline-hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          id="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile navigation wrapper */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-neutral-200 shadow-lg p-6 flex flex-col gap-4 z-40 overflow-hidden"
          >
            <ul className="flex flex-col gap-4 list-none">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block text-sm font-semibold tracking-wider py-2 transition-colors ${
                      isActive(link.href) ? 'text-neutral-950 border-l-2 border-neutral-950 pl-3' : 'text-neutral-500 pl-3'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="mt-2 pt-4 border-t border-neutral-100">
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push('/contact');
                  }}
                  variant="primary"
                  className="w-full justify-center py-3 rounded-none flex items-center gap-2 text-center"
                >
                  BOOK A CALL
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
