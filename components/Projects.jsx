import React from 'react'
import { TextHoverEffect } from './ui/text-hover-effect'
import { ProjectCard } from './ProjectCard'
import { projects } from '@/data';
import { PinContainer } from './ui/pin-contianer';
import { FaLocationArrow } from 'react-icons/fa6';


export default function Projects() {
  return (


<div className="py-20" id='projects'>
<div className='lg:flex hidden h-[18rem] w-full   flex-col text-center justify-between items-center]'>
   <TextHoverEffect text={"PROJECTS"}/>

  </div>
  <div className='flex lg:hidden  flex-col items-center justify-start px-4  '>
          
           <h2 className="sm:text-6xl  text-5xl font-sans font-black pb-2 ">Projects</h2>
                 <p className=' text-center text-slate-300 font-thin'>A small selection of recent projects
                 </p>
                  
           </div>
<div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
  {projects.map((item) => (
    <div
      className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw]"
      key={item.id}
    >
      <PinContainer
        title={item.link}
        href="https://github.com/m6474n"
      >
        <div className="relative flex items-center justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[23vh] mb-10">
          <div
            className="relative w-full h-full overflow-hidden lg:rounded-3xl"
            style={{ backgroundColor: "#13162D" }}
          >
            <img src="/bg.png" alt="bgimg" />
          </div>
          <img
            src={item.img}
            alt="cover"
            className="z-10 absolute bottom-0"
          />
        </div>

        <h1 className="font-bold font-sans lg:text-2xl md:text-xl text-base line-clamp-1">
          {item.title}
        </h1>

        <p
          className="lg:text-base font-sans text-slate-400 font-thin text-sm line-clamp-2"
          style={{
            // color: "#BEC1DD",
            margin: "1vh 0",
          }}
        >
          {item.des}
        </p>

        <div className="flex items-center justify-between mt-7 mb-3">
          <div className="flex items-center">
            {item.iconLists.map((icon, index) => (
              <div
                key={index}
                className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                style={{
                  transform: `translateX(-${5 * index + 2}px)`,
                }}
              >
                <img src={icon} alt="icon5" className="p-2" />
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center">
            <p className="flex lg:text-base font-sans md:text-xs text-sm text-purple">
              Preview
            </p>
            <FaLocationArrow className="ms-3" color="#CBACF9" />
          </div>
        </div>
      </PinContainer>
    </div>
  ))}
</div>
</div>
);
};