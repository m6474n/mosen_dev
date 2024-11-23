// import Link from 'next/link'
// import React from 'react'
// import { Button } from './ui/button'
// import { HoverBorderGradient } from './ui/hover-border-gradient'
// import { MenuItem } from './ui/navbar-menu'

// const Navbar = () => {
//   return (

//     <MenuItem />
//     // <div className='flex flex-row justify-between items-center'>

//     //   <div className="group ">
//     //     <Link href="/" className="text-4xl font-bold">
//     //       Mosen<span className="text-7xl leading-3 text-[#1ebafc]">.</span>
//     //     </Link>
//     //     <div className="line h-1 group-hover:w-full w-0 bg-[#1ebafc] transition-all "></div>
//     //   </div>

//     //   <div className="flex flex-row items-center justify-end">

//     //    <a href='#contact'>
//     //    <HoverBorderGradient>
//     //    <p> Get In Touch</p>
//     //    </HoverBorderGradient>
//     //    </a>
//     //         </div>
//     // </div>
//   )
// }

// export default Navbar

"use client";
import React, { useState } from "react";
import {
  HoveredLink,
  Menu,
  MenuItem,
  ProductItem,
} from "../ui/navbar-menu";
import { cn } from "@/lib/utils";
import { HoverBorderGradient } from "../ui/hover-border-gradient";

export function Nav() {
  return (
    <div className="sm:flex hidden mx-auto items-center justify-center">
      <HoverBorderGradient className={"p-0  flex items-center "}>
        {" "}
        <Navbar className={"top-0 relative flex items-center justify-center"} />
      </HoverBorderGradient>
    </div>
  );
}

function Navbar1({ className }) {
  const [active, setActive] = useState(null);
  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-2xl mx-auto z-50", className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={null} item="Home"></MenuItem>
        <MenuItem setActive={setActive} active={null} item="About"></MenuItem>
        <MenuItem setActive={setActive} active={null} item="Service"></MenuItem>
        <MenuItem
          setActive={setActive}
          active={null}
          item="Portfolio"
        ></MenuItem>
        <MenuItem setActive={setActive} active={null} item="Blog"></MenuItem>
        <MenuItem setActive={setActive} active={null} item="Contact"></MenuItem>
        {/* <MenuItem setActive={setActive} active={null} item="Login"></MenuItem> */}
        {/*  <MenuItem setActive={setActive} active={active} item="Services">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Web Development</HoveredLink>
            <HoveredLink href="/interface-design">Interface Design</HoveredLink>
            <HoveredLink href="/seo">Search Engine Optimization</HoveredLink>
            <HoveredLink href="/branding">Branding</HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Products">
          <div className="  text-sm grid grid-cols-2 gap-10 p-4">
            <ProductItem
              title="Algochurn"
              href="https://algochurn.com"
              src="/text.jpg"
              description="Prepare for tech interviews like never before." />
            <ProductItem
              title="Tailwind Master Kit"
              href="https://tailwindmasterkit.com"
              src="/text.jpg"
              description="Production ready Tailwind css components for your next project" />
            <ProductItem
              title="Moonbeam"
              href="https://gomoonbeam.com"
              src="/text.jpg"
              description="Never write from scratch again. Go from idea to blog in minutes." />
            <ProductItem
              title="Rogue"
              href="https://userogue.com"
              src="/text.jpg"
              description="Respond to government RFPs, RFIs and RFQs 10x faster using AI" />
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="Pricing">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/hobby">Hobby</HoveredLink>
            <HoveredLink href="/individual">Individual</HoveredLink>
            <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink>
          </div>
        </MenuItem> */}
      </Menu>
    </div>
  );
}
