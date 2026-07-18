# Component Coder — Extended Reference

## View Component Boilerplate (full file)

```tsx
'use client';

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useData } from '@/context/DataContext';
import type { CaseStudy } from '@/types';

interface MyViewProps {
  // props here
}

export default function MyView({}: MyViewProps) {
  const { caseStudies, loading } = useData();

  if (loading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <span className="text-sm text-neutral-400 font-[family-name:var(--font-inter)]">Loading…</span>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section label */}
        <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-4">
          01 / Section Name
        </p>

        {/* Section heading */}
        <h1 className="font-[family-name:var(--font-inter-tight)] text-4xl md:text-6xl font-light tracking-tight uppercase text-neutral-900 leading-none mb-8">
          Heading Text
        </h1>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-neutral-200">
          {caseStudies.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="border-b border-r border-neutral-200 p-8 transition-all duration-300 hover:bg-neutral-100 cursor-pointer"
            >
              <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-[family-name:var(--font-inter)] text-lg font-medium text-neutral-900 tracking-tight mb-3">
                {item.title}
              </h3>
              <p className="text-sm font-light text-neutral-500 leading-relaxed">
                {item.summary}
              </p>
              <div className="mt-6 flex items-center gap-2 text-neutral-900">
                <span className="text-xs font-medium">View</span>
                <ArrowRight size={12} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
```

## RevealHeading Usage
```tsx
import RevealHeading from '@/components/RevealHeading';
// Props: text: string, className?: string
<RevealHeading text="Section Title" className="text-4xl font-light uppercase" />
```

## DynamicPageHeader Usage
```tsx
import DynamicPageHeader from '@/components/DynamicPageHeader';
<DynamicPageHeader
  label="01 / Section"
  title="Page Title"
  description="Brief description of this page."
/>
```

## DefaultPageLayout Usage
```tsx
import DefaultPageLayout from '@/components/DefaultPageLayout';
<DefaultPageLayout>
  <MyView />
</DefaultPageLayout>
```
