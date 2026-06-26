import React from 'react';
import { motion } from 'motion/react';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'submit' | 'button' | 'reset';
  disabled?: boolean;
  id?: string;
}

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-bold text-xs tracking-wider uppercase rounded-none cursor-pointer';
  
  const variants = {
    primary: 'bg-neutral-950 text-white hover:bg-neutral-800 px-6 py-4 disabled:bg-neutral-400 disabled:cursor-not-allowed',
    secondary: 'bg-white text-neutral-950 border border-neutral-200 hover:border-neutral-950 px-5 py-3.5',
    ghost: 'bg-transparent text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50 px-4 py-2.5',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
