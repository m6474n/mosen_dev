import Hero from "@/components/Hero";
import About from "@/components/About";
import { Services } from "@/components/Services";

import Projects from "@/components/Projects";
import Clients, { Testimonials } from "@/components/Testimonials";
import { BeforeFooter } from "@/components/BeforeFooter";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <main>
    
  <Hero/>
  <div className="" >
  <About/>
  <Services/>
  </div>

<Projects/>
<Clients/>
<BeforeFooter/>
{/* <Footer/> */}
{/* <Testimonials/> */}
    </main>
  );
}
