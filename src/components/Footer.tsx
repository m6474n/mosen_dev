'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Github, Linkedin, ArrowUp } from 'lucide-react';
import { MOHSIN_BIO } from '../data';

export default function Footer() {
  const scrollValue = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-white py-16 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
          {/* Brand info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="font-sans font-bold text-xl tracking-wider hover:opacity-80 transition-opacity">
              MOSEN<span className="text-neutral-500">.</span>
            </Link>
            <p className="text-xs font-light text-neutral-400 tracking-wide">
              {MOHSIN_BIO.detailedBio}
            </p>
            <span className="text-xs text-neutral-500 tracking-wide font-mono mt-2" id="footer-location">
              LOCATED: {MOHSIN_BIO.location.toUpperCase()}
            </span>
          </div>

          {/* Useful navigation columns */}
          <div className="grid grid-cols-2 gap-6 md:justify-items-center">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">EXPLORE</span>
              <ul className="flex flex-col gap-2.5 text-xs font-light text-neutral-400 list-none">
                <li><Link href="/" className="hover:text-white transition-colors">HOME</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">ABOUT</Link></li>
                <li><Link href="/services" className="hover:text-white transition-colors">SERVICES</Link></li>
                <li><Link href="/case-studies" className="hover:text-white transition-colors">CASE STUDIES</Link></li>
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">RESOURCES</span>
              <ul className="flex flex-col gap-2.5 text-xs font-light text-neutral-400 list-none">
                <li><Link href="/resources" className="hover:text-white transition-colors">UTILITIES & UTILS</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">BLOG ARTICLES</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">REVENUE PIPELINES</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">TALK TO ME</Link></li>
              </ul>
            </div>
          </div>

          {/* Socials / Direct Action Call to action */}
          <div className="flex flex-col gap-6 md:items-end">
            <div className="flex flex-col md:items-end gap-2">
              <span className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">GET IN TOUCH</span>
              <a
                href={`mailto:${MOHSIN_BIO.email}`}
                className="text-sm font-light text-white underline underline-offset-4 decoration-neutral-800 hover:decoration-white transition-all tracking-wide"
                id="footer-email"
              >
                {MOHSIN_BIO.email}
              </a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href={MOHSIN_BIO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-500 text-neutral-400 hover:text-white transition-all rounded-none"
                aria-label="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={MOHSIN_BIO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-500 text-neutral-400 hover:text-white transition-all rounded-none"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${MOHSIN_BIO.email}`}
                className="p-2.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-500 text-neutral-400 hover:text-white transition-all rounded-none"
                aria-label="Email Direct"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <button
              onClick={scrollValue}
              className="mt-2 text-[10px] font-semibold text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 uppercase cursor-pointer"
              id="back-to-top"
            >
              BACK TO TOP <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Closing details */}
        <div className="mt-16 pt-8 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-light text-neutral-500 tracking-wider">
          <div id="footer-copyright">
            © {new Date().getFullYear()} MOSEN. · MUHAMMAD MOHSIN · ALL RIGHTS RESERVED
          </div>
          <div className="flex items-center gap-6">
            <span>BASED IN PAKISTAN</span>
            <span className="hidden md:inline text-neutral-800">•</span>
            <span>AVAILABLE GLOBALLY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
