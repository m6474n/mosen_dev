import React from 'react'
import { TextHoverEffect } from './ui/text-hover-effect'
import { BackgroundLines } from './ui/background-lines'
import { HoverBorderGradient } from './ui/hover-border-gradient'

export default function Hero() {
  return (
    <div className="h-[40rem] flex items-center justify-center flex-col">
    {/* <TextHoverEffect text="MOSEN"  /> */}
    <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
      <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-5xl md:text-6xl lg:text-7xl py-2 relative z-20 font-bold tracking-tight">
        Muhammad Mohsin
      </h2>
      <h3 className='bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-xl md:text-2xl lg:text-4xl   py-2 relative z-20 font-thin tracking-wider'>Full-stack Web & Mobile App Developer.</h3>
      <p className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center">
       Let's collaborate to bring your ideas to life and build something extra ordinary.
      </p>
    <div className='flex py-6 items-center justify-center gap-2'>
<HoverBorderGradient className={`font-light md:text-xl text-base md:px-8`} > Download CV </HoverBorderGradient>
<HoverBorderGradient className={`bg-slate-950 font-light md:text-xl text-base md:px-8`}> Hire Me</HoverBorderGradient>
    </div>
    </BackgroundLines>
  </div>
  )
}
