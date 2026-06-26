
import Hero from "./components/Home/Hero";
import WhyChooseUs from "./components/Home/WhyChooseUs";
import HowItWorks from "./components/Home/HowItWorks";
import FAQ from "./components/Home/Faq";
import Highlights from "./components/Home/Highlights";
import Testimonials from "./components/Home/Testimonials";
import Statistics from "./components/Home/Statistics";


export default function Home() {
  return (
    <div>
     
      <Hero />
      
      <WhyChooseUs />
      <FAQ />
      <HowItWorks />
      <Highlights/>
      <Testimonials/>
      <Statistics/>
  
    </div>
  );
}
