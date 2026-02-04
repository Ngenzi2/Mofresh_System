import AboutUs from "@/components/AboutUs";//
import { HeroSection } from "@/components/HeroSection";
import { TopNavBar } from "@/components/TopNavBar";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/AboutUs") {
      const aboutUsSection = document.getElementById("about-us");
      if (aboutUsSection) {
        aboutUsSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.pathname]);
  useEffect(() => {
    if (location.pathname === "/Home" || location.pathname === "/") {
      const homeSection = document.getElementById("home-section");
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.pathname]);
  return (
    <>
      <TopNavBar />
      <HeroSection />
     
    </>
  );
}

export default Home;
