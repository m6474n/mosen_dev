"use client";
import React from "react";
import { WavyBackground } from "./ui/wavy-background";
import GradientBorderButton from "./ui/gradientBorderButton";
import { Button } from "./ui/button";

export function BeforeFooter() {
  return (
 <div className="relative min-h-80 overflow-hidden  bg-red-50 z-10">
       <WavyBackground className="max-w-7xl flex flex-col items-center justify-center px-6 pt-20 ">
       <h2 className="sm:text-6xl text-center  text-4xl font-sans font-black pb-2 ">
       Ready to Take your <span className="font-black text-violet-400"
 >Digital Presence </span> to Next Level?
      </h2>
      <p
        className="text-base md:text-lg mt-4  text-white font-normal inter-var text-center">
        Reach out to me today and let's discuss how I can help you to achieve your goal.
      </p>

      <Button variant="outline" className={`bg-transparent border-white hover:bg-black hover:border-black rounded-full text-xl p-8 my-8 mb-32`}>Let's get in touch today!</Button>

    </WavyBackground>
 </div>
  );
}


// .text-outline {
//     -webkit-text-stroke: 1px black;  /* Chrome, Safari */
//     text-stroke: 1px black; /* Firefox */
//     color: transparent;  /* Make the text color transparent */
//   }