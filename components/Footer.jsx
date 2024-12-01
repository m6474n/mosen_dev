

import React from "react";
import { FaLinkedinIn ,FaFacebookF,FaGithub} from "react-icons/fa";
import Link from "next/link";

export default function Footer() {
  return (
    <div>
      

    <div className=" relative w-screen border-[1px]  border-slate-800 flex-row flex justify-between">
      <div className="logo flex flex-row justify-between items-center md:w-80 w-screen border-r  border-slate-800 ">
       <div className="flex mx-auto">
       
          
          <h1 className="text-slate-300 text-sm font-thin ">find me in:</h1>{" "}
        
       </div>
        <div className="social flex flex-row">

      <div className=" border-l  border-slate-800 p-4">  <Link href={'https://www.linkedin.com/in/muhammad-mohsin-133886261/'}><FaLinkedinIn className="hover:text-violet-500 transition-all" /></Link></div>
      <div className=" border-l  border-slate-800 p-4">  <Link href={'https://www.facebook.com/m.mohsin.03/'}><FaFacebookF className="hover:text-violet-500 transition-all"  /></Link></div>
        </div>


      </div>
      <div className="max-w-7xl md:flex hidden  w-full items-center  justify-center border-slate-800 p-4 gap-3 ">
        
        <h1 className="text-slate-300 text-sm font-thin text-center">
       &copy;2024 All Right Reserved. Designed & Developed by Mosen.          </h1>{" "}
      </div>

      <div className="Contact p-4 w-56 md:flex hidden  border-l  items-center justify-center  border-slate-800 ">
        <Link href={`https://github.com/m6474n`} className="group"> 
          {" "}
          <div className="flex flex-row items-center justify-center gap-3 ">
          <h1 className="text-slate-300 text-sm font-thin text-center group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-no-repeat group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-violet-500 group-hover:to-pink-500">
            @m6474n 

          </h1>{" "}
          <FaGithub className="group-hover:text-violet-500" />
          </div>
        </Link>
      </div>
    </div>
    </div>
  )
}
