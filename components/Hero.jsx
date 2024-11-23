'use client'
import Link from "next/link";
import { BackgroundBeamsWithCollision } from "./ui/background-beams-with-collision";
import CodeDisplay from "./ui/codeDisplay";
import { HoverBorderGradient } from "./ui/hover-border-gradient";
import GradientBorderButton from "./ui/gradientBorderButton";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="w-sceen h-[88vh]  " id="home">
      <BackgroundBeamsWithCollision>
        <main className="max-w-7xl w-screen m-auto sm:px-14 px-4 h-full flex flex-row items-center justify-center space-y-10">
          <div className="details  w-full z-10 lg:text-start text-center">
            <p className="text-sm font-thin ">Hi all, I am</p>
            <h2 className="sm:text-6xl  text-5xl font-sans font-black "> Muhammad Mohsin</h2>
            {/* <h2 className="text-2xl relative z-20 md:text-4xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight"> Muhammad Mohsin</h2> */}

            {/* <h3 className="text-2xl font-thin text-blue-400"> */}
            <h3 className="lg:text-2xl text-lg bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              {">"} Full-Stack Web & Mobile App Developer{" "}
            </h3>

            <div className="comments pt-12">
              <p className="text-gray-500"> // complete the game to continue</p>
              <p className="text-gray-500">
                // you can also see it on my Github page
              </p>
              <p>
                <span className=" text-blue-500">const</span>
                <span className="  text-green-400"> githubLink</span> ={" "}
                <Link href={"https://github.com/m6474n"}>
                  <span className="  text-orange-400">
                    “https://github.com/m6474n”
                  </span>
                </Link>
              </p>
            </div>
            <div className="actions flex flex-row items-center gap-4 pt-6 lg:justify-start justify-center">
                {/* <HoverBorderGradient> Download CV</HoverBorderGradient> */}
                <GradientBorderButton title={"Download CV"} className={`px-6  ` }/> 
                <Button className={`rounded-full py-[24px] bg-purple-500 hover:bg-violet-500 text-white px-6`}> Hire Me</Button>
            </div>
          </div>

          <div className="img relative  lg:h-[88vh]  lg:w-full">
            <div className="absolute top-20 left-20 h-[350px] w-[350px] bg-purple-500 blur-3xl opacity-35" />
            <div className="absolute top-40 right-0 h-[350px] w-[350px] bg-violet-500 blur-3xl opacity-35" />
            <div className="absolute bottom-60 right-52 h-[350px] w-[350px] bg-pink-500 blur-3xl opacity-35" />
            <div className="absolute top-80 right-0 h-[350px] w-[350px] bg-violet-500 blur-3xl opacity-35" />
            <div className="absolute top-[50%] -translate-y-[50%] w-full px-6 opacity-75 hidden lg:block ">
              <div className="opacity-50 ">
                <CodeDisplay
                  code={`console.log("Oops! Just kidding...");
console.log("404 not found! Wait... you're here! 🎉");`}
                />
              </div>
              <CodeDisplay
                code={`
// Greeting a new visitor (and being cheeky)

console.log("Hello, new visitor! 👋");
console.log("Are you here to steal my secrets? 🤫");
setTimeout(() => {
  console.log("Just kidding... Welcome to my portfolio! 🎉");
}, 1000);

        `}
              />

              <div className="opacity-50">
                <CodeDisplay
                  code={`console.log("Did you know? Code is basically magic. ✨");
setTimeout(() => {
  console.log("Shhh... don't tell anyone. It's a secret. 🤫");
}, 1200);`}
                />
              </div>
            </div>
          </div>
        </main>
      </BackgroundBeamsWithCollision>
    </section>
  );
}
