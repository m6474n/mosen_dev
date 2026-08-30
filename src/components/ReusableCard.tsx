'use client';

import React from 'react';
import { motion } from 'motion/react';

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
    ? 'bg-neutral-900' 
    : variant === 'muted' 
      ? 'bg-neutral-50/50' 
      : 'bg-white';

  const borderStyles = hoverable
    ? variant === 'dark'
      ? 'border border-neutral-800 hover:border-neutral-700'
      : 'border border-neutral-200 hover:border-neutral-900'
    : 'border border-neutral-100';
  
  const paddingStyles = noPadding ? '' : 'p-8 md:p-12';
  
  const motionProps = hoverable
    ? {
        whileHover: { y: -4, scale: 1.01 },
        transition: { type: 'spring' as const, stiffness: 350, damping: 22 }
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      className={`${paddingStyles} ${bgStyles} ${borderStyles} shadow-xs flex flex-col justify-between ${className}`}
      id={id}
    >
      {children}
    </motion.div>
  );
}
