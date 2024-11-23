import React from "react";

import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { gridItems } from "@/data";

export function Services() {
  return (
   <div className="w-screen relative overflow-visible " id="service">
{/* <div className="absolute w-[300px] h-[300px] bottom-0 left-40 bg-violet-500 -z-10 blur-3xl opacity-20" /> */}
{/* <div className="absolute w-[200px] h-[100px] top-0 bg-pink-500 -z-10 blur-3xl opacity-35"  /> */}
     <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem] px-12">
      {gridItems.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          img={item.img}
          className={item.className}
          />
      ))}
    </BentoGrid>
   </div>
  );
}
const Skeleton = () => (
  <div
    className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black"></div>
);
const items = [
  {
    title: "The Dawn of Innovation",
    description: "Explore the birth of groundbreaking ideas and inventions.",
    img:"/img2.jpg",
    className: "md:col-span-2",
    
  },
  {
    title: "The Digital Revolution",
    description: "Dive into the transformative power of technology.",
    img:"/img3.jpg",
    className: "md:col-span-1",
  },
  {
    title: "The Art of Design",
    description: "Discover the beauty of thoughtful and functional design.",
    className: "md:col-span-1",
    img:"/appdev.jpg",
  },
  {
    title: "The Power of Communication",
    description:
      "Understand the impact of effective communication in our lives.",
    className: "md:col-span-2",img:"/customdev.jpg",
  },
];
