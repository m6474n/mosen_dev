"use client";
import { cn } from "@/lib/utils";
import React from "react";
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { BentoGrid, BentoGridItem } from "./ui/bento-grid";
import { Globe, SkeletonFour1 } from "./ui/FeatureSection";
import CodeDisplay from "./ui/codeDisplay";

export function Services() {
  return (
    <section className="py-12 z-10  " id="services">
        <main className=" lg:h-full min-h-[60vh]  lg:gap-10  flex lg:flex-row flex-col ">
      <BentoGrid className="max-w-7xl mx-auto md:auto-rows-[20rem] relative px-6">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          />
      ))}
    </BentoGrid>
    </main>
    </section>
  );
}

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    (<motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-white dark:bg-black">
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
            <div>
            Full-stack Developer at Twinspider 
          </div>
        {/* <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" /> */}
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 ml-auto bg-white dark:bg-black">
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black">
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
    </motion.div>)
  );
};
const skills = [
  { id: 1, progress: 95, color: "#02569B", name: "Flutter" },          // Blue (Flutter official color)
  { id: 2, progress: 85, color: "#FFCA28", name: "Firebase" },         // Yellow (Firebase official color)
  { id: 3, progress: 70, color: "#306998", name: "Next Js" },           // Blue (Next.js official color)
  { id: 4, progress: 85, color: "#38B2AC", name: "Tailwind" },         // Teal (Tailwind CSS brand color)
  { id: 5, progress: 60, color: "#336791", name: "PostgreSQL" },       // Blue (PostgreSQL official color)
  { id: 7, progress: 50, color: "#2D3748", name: "Supabase" },         // Dark Gray (Supabase official color)
  { id: 8, progress: 90, color: "#21759B", name: "WordPress" },        // Blue (WordPress official color)
  { id: 9, progress: 95, color: "#3C3C3C", name: "Elementor" },        // Dark Gray (Elementor logo color)
  { id: 10, progress: 60, color: "#CC0000", name: "ROR" },             // Red (Ruby on Rails official color)
];



const Experience = () => {
  return (
    <div className="overflow-scroll">
      <CodeDisplay code={`// Education
const _intermediate = "DAE Instrumentation Engineer, Govt. Swedish Pakistani College of Technology, Gujrat, Pakistan";
const _graduation = "BS Hons Information Technology, National College of Business Administration & Economics, Lahore, Pakistan";

// Experience
let _role = "";
let _start = "Apr 2022";
let _end = "Present";
for (_start to _end) {
  _role = "Freelance Graphic Designer at Fiverr";
}
let _start = "Aug 2023";
for (_start to _end) {
  _role = "Freelance WordPress Designer at Fiverr";
}
let _start = "Jan 2024";
for (_start to _end) {
  _role = "Flutter Developer at Twinspider Technologies, Gujrat Pakistan";
}

        `}/>
    </div>
  )
}

const SkeletonTwo = ({ items }) => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: (progress) => ({
      width: `${progress}%`,
      transition: {
        duration: 0.2,
      },
    }),
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2 overflow-scroll"
    >
     
      {items.map((item, i) => (
         <div  key={i} className="grid grid-cols-5 gap-8 ">
          <div className="col-span-2">

          <p>{item.name}</p>
          </div>
        <div className="col-span-3">
        <motion.div
          key={item.id}
          variants={variants}
          custom={item.progress}  // Pass the progress as a custom variant
          style={{
            maxWidth: `${item.progress}%`, // Set maxWidth based on the progress
            backgroundColor:  "#fff", // Default color (light gray) item.color ||
          }}
          className="flex flex-row rounded-md border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-neutral-100 dark:bg-black w-full h-4"
        />
        </div>
         </div>
       
      ))}
    </motion.div>
  );
};

const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    (<motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex overflow-hidden flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
   
      >
        <SkeletonFour1 />

      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>)
  );
};
const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <div className="overflow-scroll flex flex-row items-center justify-center ">
      <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2">
      <motion.div
        variants={first}
        className="h-full md:w-1/3 w-[200px] rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <Image
          src="/profile-pic.png"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10" />
        <p
          className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Custom Web Application Development
        </p>
        <p
          className="border border-blue-500 text-center bg-red-100 dark:bg-red-900/20 text-blue-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Web development
        </p>
      </motion.div>
      <motion.div
        className="h-full relative z-20  md:w-1/3 w-[200px]  rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <Image
          src="/profile-pic.png"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10" />
        <p
          className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Hybrib Mobile Application Development
        </p>
        <p
          className="border border-green-500 text-center bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
          App Developemt
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full  md:w-1/3 w-[200px]  rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <Image
          src="/profile-pic.png"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10" />
        <p
          className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Creative Brand Identity
        </p>
        <p
          className="border border-orange-500 text-center bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Graphic Designing
        </p>
      </motion.div>
    </motion.div>
    </div>
  );
};
const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="overflow-scroll">
      <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-white dark:bg-black">
        <Image
          src="/profile-pic.png"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10" />
        <p className="text-xs text-neutral-500">
       <span className=" font-sans text-white"> Mastering Cloud-Native Development:</span>  Expanding my expertise in  <span className="text-green-400 font-sans font-bold ">AWS</span>,
       <span className="text-blue-400 font-sans font-bold ">Kubernetes</span> , and  <span className="text-cyan-400 font-sans font-bold">Docker</span> to build scalable, high-performance applications.
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-white dark:bg-black">
        <Image
          src="/profile-pic.png"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10" />
        <p className="text-xs text-neutral-500">
        <span className=" font-sans text-white">Exploring  AI & Machine Learning:</span>    Learning to integrate  <span className="text-violet-400 font-sans font-bold ">AI</span> and <span className="text-pink-400 font-sans font-bold">ML </span>  
        models into web and mobile apps for smarter, data-driven user experiences.
         
        </p>
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-white dark:bg-black">
        <Image
          src="/profile-pic.png"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10" />
        <p className="text-xs text-neutral-500">
        <span className=" font-sans text-white">Expanding Open-Source Contributions:</span>    Actively contributing to 
        high-impact projects, especially around <span className="text-blue-400 font-sans font-bold " >Flutter</span> and  <span className="text-orange-400 font-sans font-bold ">Firebase</span>, 
        to drive innovation in the community.
         
        </p>
      </motion.div>
      {/* <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-white dark:bg-black">
        <p className="text-xs text-neutral-500">Use PHP.</p>
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
      </motion.div> */}
    </motion.div>
    </div>
  );
};
const items = [
  {
    title: "My Journey",
    description: (
      <span className="text-sm">
  From academic foundations to real-world experience, I’ve continuously honed my skills to create innovative solutions and deliver impactful results.      </span>
    ),
    // header: <SkeletonOne />,
    header: <Experience />,
    className: "md:col-span-1",
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "My Tech Stack",
    description: (
      <span className="text-sm">
        Mastering a diverse set of technologies to build robust, scalable, and innovative solutions..
      </span>
    ),
    header: <SkeletonTwo items={skills} />,
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "I'm very flexible with time zone communications",
    description: (
      <span className="text-sm">
        Connecting with teams worldwide to build innovative solutions across borders.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "What I Offer",
    description: (
      <span className="text-sm">
       Providing end-to-end solutions with expertise in full-stack development, from front-end to back-end and beyond.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },

  {
    title: "Looking Ahead",
    description: (
      <span className="text-sm">
        I am constantly evolving as a developer and am excited about the future of full-stack development. 
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },
];




