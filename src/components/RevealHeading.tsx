import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RevealHeadingProps {
  text: string;
  className?: string;
}

export default function RevealHeading({ text, className = '' }: RevealHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const chars = containerRef.current.querySelectorAll('.reveal-letter');
    
    // Kill existing animations of these targets to prevent conflicts on route/tab change
    gsap.killTweensOf(chars);
    
    // Animate letters matching the premium Home hero style
    gsap.fromTo(chars,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.95,
        stagger: 0.03, // Snappy timing for standard headers
        ease: 'power4.out',
        delay: 0.05
      }
    );
  }, [text]);

  const words = text.split(' ');

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-wrap select-none py-1 leading-[0.95] ${className}`}
    >
      {words.map((word, wordIdx) => (
        <span 
          key={wordIdx} 
          className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0 overflow-hidden"
        >
          {word.split('').map((char, charIdx) => (
            <span 
              key={charIdx} 
              className="reveal-letter inline-block translate-y-[110%] opacity-0"
              style={{ display: 'inline-block' }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
