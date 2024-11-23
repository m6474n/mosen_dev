import { cn } from "@/lib/utils";
import Image from "next/image";

export const BentoGrid = ({
  className,
  children
}) => {
  return (
    (<div
      className={cn(
        "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto ",
        className
      )}>
      {children}
    </div>)
  );
};

export const BentoGridItem = ({
  className,
  title,
  img,
  id,
  description,

}) => {
    console.log(img)
  return (



    (<div
      className={cn(
        "relative overflow-hidden rounded-xl group hover:shadow-xl transition duration-200 border border-slate-800 ",
        className
      )}>

    <div className="w-full h-full absolute">
    <Image
      src={img}
      fill
      alt="about"
      className="object-cover object-center"
    />
  </div>

  <div className="absolute -bottom-40 z-10 p-4 transition-all transform group-hover:bottom-10 group-hover:translate-x-2 group-hover:z-20 duration-700 ">
    <h3 className="text-white font-sans text-xl font-bold">{title}</h3>
    <h3 className="text-white">{description}</h3>
  </div>

  <div className="absolute w-full h-full group-hover:bg-black/[0.8] transition-all  duration-700 " />

     </div>)
  );
};




{/* <div className={cn("border border-slate-800 rounded-lg relative overflow-hidden group", className)}>
  <div className="w-full h-full absolute">
    <Image
      src={img}
      fill
      alt="about"
      className="object-cover object-center"
    />
  </div>

  <div className="absolute -bottom-40 z-10 p-4 transition-all transform group-hover:bottom-10 group-hover:translate-x-2 group-hover:z-20 duration-700 ">
    <h3 className="text-white font-sans text-xl font-bold">{title}</h3>
    <h3 className="text-white">{description}</h3>
  </div>

  <div className="absolute w-full h-full group-hover:bg-black/[0.4] transition-all  duration-700 " />

</div> */}