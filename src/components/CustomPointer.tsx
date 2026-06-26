import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomPointer() {
  const [enabled, setEnabled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  // Motion values for smooth fluid animations
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for the outer lagging circle helper
  const springConfig = { damping: 30, stiffness: 220, mass: 0.6 };
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices
    const hasTouch = window.matchMedia('(pointer: coarse)').matches;
    if (hasTouch) {
      return;
    }

    setEnabled(true);
    setVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if the current target or its closest parent is interactive
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]') ||
        target.closest('.group') ||
        target.classList.contains('cursor-pointer') ||
        window.getComputedStyle(target).cursor === 'pointer';

      setHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseover', handleMouseOver);

    // Apply global style to hide default cursor when active
    const htmlElement = document.documentElement;
    htmlElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      htmlElement.classList.remove('custom-cursor-active');
    };
  }, [mouseX, mouseY, visible]);

  if (!enabled || !visible) return null;

  return (
    <>
      {/* ─── Lagging Active Outer Follower ring ─── */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border-[0.5px] border-white pointer-events-none z-[99999] mix-blend-difference"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: hovered ? 76 : 32,
          height: hovered ? 76 : 32,
          backgroundColor: hovered ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0)',
          borderColor: hovered ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.6)',
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
        }}
      />

      {/* ─── Ultra Snappy Precise Center Click Dot ─── */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[99999] mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hovered ? 0.4 : 1,
          backgroundColor: '#ffffff',
        }}
        transition={{
          type: 'tween',
          duration: 0.15,
        }}
      />
    </>
  );
}
