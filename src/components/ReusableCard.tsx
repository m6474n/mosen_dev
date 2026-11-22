'use client';

import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ReusableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
  variant?: 'white' | 'muted' | 'dark';
  key?: any;
  id?: string;
  noPadding?: boolean;
}

export default function ReusableCard({
  children,
  hoverable = true,
  className = '',
  variant = 'white',
  id,
  noPadding = false,
}: ReusableCardProps) {
  const bgStyles = variant === 'dark' 
    ? 'bg-neutral-950 text-white' 
    : variant === 'muted' 
      ? 'bg-neutral-50/80 text-neutral-900' 
      : 'bg-white text-neutral-900';

  const borderStyles = variant === 'dark'
    ? 'border border-neutral-800' + (hoverable ? ' hover:border-neutral-700 hover:shadow-md' : '')
    : 'border border-neutral-200/90' + (hoverable ? ' hover:border-neutral-950/40 hover:shadow-md' : '');

  const paddingStyles = noPadding ? '' : 'p-6 sm:p-8 md:p-10';

  const motionProps = hoverable
    ? {
        whileHover: { y: -3, scale: 1.008 },
        transition: { type: 'spring' as const, stiffness: 350, damping: 24 }
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      className={cn(
        "rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between transition-all duration-300",
        paddingStyles,
        bgStyles,
        borderStyles,
        className
      )}
      id={id}
    >
      {children}
    </motion.div>
  );
}
