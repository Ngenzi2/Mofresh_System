import { useNavigate } from "react-router";
import { Button } from "./ui/button";
import HeroImage from "../assets/Hero.jpg";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="w-full h-300px] md:h-[600px] lg:h-[680px] relative overflow-hidden bg-green-600 flex  md:flex-row md:justify-center md:items-center px-4 sm:px-8 md:px-16 lg:px-25">
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full items-center justify-center text-white px-4 text-size-2xl w-full sm:w-1/2">
          <div className="max-w-4xl text-center sm:text-left">
            {/* Main heading */}
            <h1
              className="
        font-heading font-bold
        leading-tight sm:leading-tight md:leading-snug
        text-2xl md:text-6xl lg:text-6xl
     text-start
      "
            >
              Farm to Fork, <br />
              Within 24 Hour
            </h1>

            {/* Subtitle */}
            <p
              className="
        mt-4 sm:mt-6
        text-sm  md:text-lg
        font-sans
        max-w-xl
        text-center sm:text-start
      "
            >
              Experience the premium cold chain logistics that keeps your food
              at peak freshness from our farms to your table.
            </p>

            {/* CTA buttons */}
            <div
              className="
        my-3  md:my-16
        flex items-center
        justify-center sm:justify-start
        gap-4
      "
            >
              <Button 
                onClick={() => navigate("/register")}
                className="w-auto text-green-600 bg-[#fcdf03] font-bold text-sm md:text-2xl hover:bg-amber-300 px-6 sm:px-8 md:px-12 lg:px-15 rounded-xl py-4 sm:py-5 md:py-6 lg:py-7"
              >
                Shop Fresh Now
              </Button>
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 flex justify-center sm:justify-end px-25">
          <img
            src={HeroImage}
            alt="Hero Image"
            className="w-full sm:w-auto max-w-full h-auto max-h-[200px] sm:max-h-none sm:h-[400px] md:h-[500px] lg:h-[570px] object-cover rotate-[-3deg] pt-0 sm:pt-10 md:pt-20"
          />
        </div>
      </section>
    </>
  );
};