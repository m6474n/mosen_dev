'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gsap from 'gsap';

interface InitialPreloaderProps {
  onComplete: () => void;
  key?: string;
}

export default function InitialPreloader({ onComplete }: InitialPreloaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const obj = { value: 0 };
    
    // Animate from 0 to 100 over exactly 2.0 seconds with a rich, smooth ease curve
    gsap.to(obj, {
      value: 100,
      duration: 2.2,
      ease: 'power3.inOut',
      onUpdate: () => {
        setProgress(Math.floor(obj.value));
      },
      onComplete: () => {
        // Give a tiny breather for visual satisfaction at 100%
        setTimeout(() => {
          onComplete();
        }, 150);
      }
    });
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        y: -30,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
      }}
      className="fixed inset-0 bg-neutral-950 z-[9999] flex flex-col justify-between p-8 md:p-16 select-none"
    >
      {/* Top Meta info */}
      <div className="flex justify-between items-center text-neutral-500 font-mono text-[9px] uppercase tracking-widest">
        <span>MUHAMMAD MOHSIN // SYSTEM PRELOAD</span>
        <span>2026 INDEX.CJS</span>
      </div>

      {/* Main Counter & Progress */}
      <div className="max-w-4xl mx-auto w-full flex flex-col justify-center items-start">
        <div className="overflow-hidden mb-6">
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans font-black text-8xl md:text-[180px] lg:text-[230px] leading-none tracking-tighter text-white uppercase"
          >
            {String(progress).padStart(3, '0')}%
          </motion.div>
        </div>

        {/* Linear Progress Indicator */}
        <div className="w-full h-[2px] bg-neutral-800/80 relative overflow-hidden">
          <motion.div 
            className="absolute left-0 top-0 bottom-0 bg-white"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* Status indicator row */}
        <div className="w-full flex justify-between items-center text-[10px] font-mono text-neutral-400 mt-4 uppercase">
          <span>PIPELINE ENGINE: ACTIVE</span>
          <span>ESTABLISHING DEPLOYED GRAPH...</span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex justify-between items-end">
        <div className="font-mono text-[9px] text-neutral-600 uppercase tracking-wider">
          PLATFORM INITIALIZATION SUCCESSFUL
        </div>
        <div className="font-mono text-[9px] text-neutral-500 uppercase tracking-widest">
          STANDBY // PORT 3000
        </div>
      </div>
    </motion.div>
  );
}
