import React from 'react';
import { motion } from 'motion/react';

interface ReusableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
  variant?: 'white' | 'muted';
  key?: any;
  id?: string;
}

export default function ReusableCard({
  children,
  hoverable = true,
  className = '',
  variant = 'white',
  ...props
}: ReusableCardProps) {
  const bgStyles = variant === 'muted' ? 'bg-neutral-50/50' : 'bg-white';
  const borderStyles = hoverable
    ? 'border border-neutral-200 hover:border-neutral-900'
    : 'border border-neutral-100';
  
  const motionProps = hoverable
    ? {
        whileHover: { y: -4, scale: 1.01 },
        transition: { type: 'spring', stiffness: 350, damping: 22 }
      }
    : {};

  return (
    <motion.div
      {...motionProps}
      className={`p-8 md:p-12 ${bgStyles} ${borderStyles} shadow-xs flex flex-col justify-between ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
