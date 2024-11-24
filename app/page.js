import Hero from "@/components/Hero";
import About from "@/components/About";
import { Services } from "@/components/Services";

import Projects from "@/components/Projects";


export default function Home() {
  return (
    <main>
    
  <Hero/>
  <div className="" >
  <About/>
  <Services/>
  </div>

<Projects/>

    </main>
  );
}
