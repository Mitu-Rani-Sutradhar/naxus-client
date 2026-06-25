import Navbar from "./components/Home/Navbar";
import Footer from "./components/Home/Footer";
import Hero from "./components/Home/Hero";
import WhyChooseUs from "./components/Home/WhyChooseUs";
import HowItWorks from "./components/Home/HowItWorks";
import FAQ from "./components/Home/Faq";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <WhyChooseUs />
      <FAQ />
      <HowItWorks />
      <Footer />
    </div>
  );
}
