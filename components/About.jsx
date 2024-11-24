import Image from 'next/image'
import React from 'react'
import { Button } from './ui/button'
import { MdArrowOutward } from "react-icons/md";
import { FaLocationArrow } from "react-icons/fa6";


export default function About() {
  return (
    <section className="w-sceen mb-[500px] lg:mb-0  sm:mb-80" id="about">
        <main className="max-w-7xl w-screen m-auto lg:px-14 px-0 lg:h-full h-screen  pt-24 lg:gap-10  flex lg:flex-row flex-col items-start ">
          <div className="Img ">
            {/* <div className='bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 p-[2px] rounded-2xl'> */}
            <div className='flex relative  w-screen lg:h-[450px]  h-80 lg:w-96 justify-center items-center'>
            <div className='absolute lg:w-[360px] lg:h-[450px]  h-80 w-80 lg:block hidden  border -top-10 -left-7 rounded-lg border-pink-400'/>
           
            <div className="absolute lg:h-[450px] lg:w-[360px] h-80 w-80 lg:rounded-2xl rounded-full overflow-hidden">
                <Image src={'/profile-pic.png'} alt='moden_profile' fill className='onject-center object-cover'/></div>    
            
            {/* </div> */}
          </div>
          </div>
          <div className="detail space-y-3  lg:px-0 p-6 lg:text-start text-center">
           
          <p className="text-base text-orange-400">Introduction</p>
          <h2 className="sm:text-6xl  text-5xl font-sans font-black pb-2 ">About Me</h2>
          <p className='pb-6 text-slate-300 font-thin'>I specialize in transforming your vision into beautifully crafted, high-performing apps and websites. With over 3 years of experience as a  <span className='text-violet-400  font-black' >Full Stack Developer & Designer</span>, I blend design, functionality, and cutting-edge technology to create digital solutions that not only look great but deliver results. From <span className='text-cyan-500 font-black' >Flutter</span> to <span className='text-green-500 font-black'  >WordPress</span>, <span className='text-orange-400 font-black' >Next.js</span> to <span className='text-red-600 font-black' >Ruby on Rails</span>, I handle every step of the process to ensure your project exceeds expectations. Let’s collaborate to bring your ideas to life and build something extraordinary together!</p>
        
        <Button className={`rounded-full md:p-8 p-6 md:text-xl  hover:bg-violet-400 hover:text-white`}> Let's Connect <FaLocationArrow  className='text-2xl h-10 w-10'/>
        </Button>
          </div>

        </main>
     
    </section>
  )
}
