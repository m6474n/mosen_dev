'use client'
import React from "react";
import { CiMenuFries } from "react-icons/ci";
import Link from "next/link";
import { cn } from "@/lib/utils";


export default function Menu() {
    const navMenu = [
        { title: "_about-me", link: "/", isActive: true },
        { title: "_services", link: "/", isActive: false },
        { title: "_porjects", link: "/", isActive: false },
       
      ];
    
  return (
    <div>
       <div className=" w-screen border-[1px]  border-slate-800 flex-row flex justify-between">
      <div className="logo p-4  md:w-80 w-screen  md:border-r flex justify-between  border-slate-800 ">
        <Link href={`/`} className="group">
          {" "}
          <h1 className="text-slate-300 text-sm font-thin group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-no-repeat group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-violet-500 group-hover:to-pink-500">@mosen_dev</h1>{" "}
          <div className="w-0  group-hover:w-full h-[1px] mt-[1px]   bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 transition-all" />

        </Link>
        
      <div className="md:hidden flex">  <CiMenuFries /></div>


      </div>
      <div className="max-w-7xl md:flex hidden  w-full  border-slate-800  gap-3 ">
       {navMenu.map((e)=> (
         <Link href={e.link} className={cn("px-4 group border-r border-slate-800 p-4" )} key={e.title} >
         {" "}
         <h2 className="text-slate-300 text-sm font-thin group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-no-repeat group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-violet-500 group-hover:to-pink-500 ">{e.title}</h2>{" "}
         <div className="w-0  group-hover:w-full h-[1px] mt-[1px]   bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 transition-all" />
       </Link>
       ))}
      </div>

      <div className="Contact p-4 w-56 md:flex hidden  border-l  items-center justify-center  border-slate-800 ">
        <Link href={`/`} className="group">
          {" "}
          <h1 className="text-slate-300 text-sm font-thin group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-no-repeat group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-violet-500 group-hover:to-pink-500">
            _contact-me
          </h1>{" "}
          <div className="w-0  group-hover:w-full h-[1px] mt-[1px]   bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 transition-all" />

        </Link>
      </div>
    </div>

    </div>
  )
}
