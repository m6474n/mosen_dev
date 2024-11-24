
"use client";
import React, { useState, useEffect } from "react";
import { CiMenuFries } from "react-icons/ci";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Menu() {
  const [navMenu, setNavMenu] = useState([
    { title: "_hello", link: "#home", isActive: true, sectionId: "home" },
    { title: "_about-me", link: "#about", isActive: false, sectionId: "about" },
    { title: "_services", link: "#services", isActive: false, sectionId: "services" },
    { title: "_projects", link: "#projects", isActive: false, sectionId: "projects" },
  ]);

  useEffect(() => {
    const handleScroll = () => {
      navMenu.forEach((item, index) => {
        const section = document.getElementById(item.sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setNavMenu((prev) =>
              prev.map((navItem, i) => ({
                ...navItem,
                isActive: i === index,
              }))
            );
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navMenu]);

  return (
    <div>
      <div className="w-screen border-[1px] border-slate-800 flex flex-row justify-between fixed backdrop-blur-md z-50">
        <div className="logo p-4 md:w-80 w-screen md:border-r flex justify-between border-slate-800">
          <Link href={`/`} className="group">
            <h1 className="text-slate-300 text-sm font-thin group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-no-repeat group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-violet-500 group-hover:to-pink-500">
              @mosen_dev
            </h1>
            <div className="w-0 group-hover:w-full h-[1px] mt-[1px] bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 transition-all" />
          </Link>

          <div className="md:hidden flex">
            <CiMenuFries />
          </div>
        </div>
        <div className="max-w-7xl md:flex hidden w-full border-slate-800">
          {navMenu.map((e, index) => (
            <Link href={e.link} key={index}>
              <button
                className={cn(
                  "px-4 group border-r border-slate-800 p-4 hover:border-b-2 transition-all hover:border-violet-500",
                  e.isActive && "border-b-2 border-violet-500"
                )}
              >
                <h2
                  className={cn(
                    "text-slate-300 text-sm font-thin group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-no-repeat group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-violet-500 group-hover:to-pink-500",
                    e.isActive &&
                      "bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500"
                  )}
                >
                  {e.title}
                </h2>
              </button>
            </Link>
          ))}
        </div>

        <div className="Contact p-4 w-56 md:flex hidden border-l items-center justify-center border-slate-800">
          <Link href={`/`} className="group">
            <h1 className="text-slate-300 text-sm font-thin group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-no-repeat group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:via-violet-500 group-hover:to-pink-500">
              _contact-me
            </h1>
            <div className="w-0 group-hover:w-full h-[1px] mt-[1px] bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
