import React from 'react';
import { motion } from 'motion/react';

interface DefaultPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function DefaultPageLayout({
  children,
  className = '',
  ...props
}: DefaultPageLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full flex flex-col pt-16 pb-12 bg-white min-h-screen ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '', ...props }: ContainerProps) {
  return (
    <div 
      className={`w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-2 md:gap-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
}
