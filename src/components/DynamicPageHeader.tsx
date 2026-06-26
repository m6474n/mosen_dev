import React from 'react';
import RevealHeading from './RevealHeading';

interface DynamicPageHeaderProps {
  badge: string;
  title: string;
  subtitle?: string;
  hasBorder?: boolean;
}

export default function DynamicPageHeader({
  badge,
  title,
  subtitle,
  hasBorder = true,
}: DynamicPageHeaderProps) {
  return (
    <div className={`pt-4 ${hasBorder ? 'border-b border-neutral-100 pb-6 mb-8' : 'mb-6'}`}>
      {/* Top Badge line */}
      <div className="flex items-center gap-3 mb-6 text-neutral-400">
        <span className="w-6 h-[1px] bg-neutral-300 shrink-0"></span>
        <span className="text-[10px] font-extrabold tracking-widest uppercase font-sans">
          {badge.toUpperCase()}
        </span>
      </div>

      {/* Main Title heading */}
      <div className="mb-6">
        <RevealHeading
          text={title.toUpperCase()}
          className="font-sans font-black text-4xl md:text-6xl tracking-tight text-neutral-950 uppercase leading-tight"
        />
      </div>

      {/* Optional subtitle block */}
      {subtitle && (
        <p className="text-sm md:text-lg font-light text-neutral-600 max-w-3xl leading-relaxed tracking-wide">
          {subtitle}
        </p>
      )}
    </div>
  );
}
