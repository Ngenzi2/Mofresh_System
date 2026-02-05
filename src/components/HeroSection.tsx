import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star, Plus, ChevronRight, Thermometer, Package, User, ShoppingBag } from "lucide-react";
import { Button } from "./ui/button";

// hero images
import HeroImg from "@/assets/Hero.jpg";
import Hero1 from "@/assets/hero-1.png";
import Hero2 from "@/assets/hero-2.png";
import Hero3 from "@/assets/hero-3.png";
import Hero4 from "@/assets/hero-4.png";

// category images

import cat1 from "@/assets/vegetables.png";
import cat2 from "@/assets/meat.png";
import cat3 from "@/assets/fruits.png";
import cat4 from "@/assets/freezer.png";

// product images

import pro1 from "@/assets/brocoli.png";
import pro2 from "@/assets/orange.png";
import pro3 from "@/assets/freshmeat.png";
import pro4 from "@/assets/banana.png";
import pro5 from "@/assets/fish.png";
import pro6 from "@/assets/pepper.png";

// offer pictures 
import of1 from "@/assets/10.png";
import of2 from "@/assets/20.png";
import of3 from "@/assets/40.png";
import of4 from "@/assets/offer.png";
import of5 from "@/assets/getstarted.png";

//client images

import cli1 from "@/assets/clients.png";
import cli2 from "@/assets/client-1.png";
import cli3 from "@/assets/client-2.png";








export const HeroSection = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // 4 hero images for carousel
  const heroImages = [Hero1,Hero2,Hero3,Hero4];

  // Auto-rotate hero carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const categories = [
    { id: 1, name: "Vegetables", image: cat1 },
    { id: 2, name: "Meat", image: cat2 },
    { id: 3, name: "Fruits", image: cat3 },
    { id: 4, name: "Freezing Boxes", image: cat4},
  ];

  const products = [
    {
      id: 1,
      name: "Fresh broccoli",
      price: 1000,
      unit: "Rwf/kg",
      discount: 15,
      rating: 4,
      badge: "Popular",
      badgeColor: "bg-yellow-400",
      image: pro1,
    },
    {
      id: 2,
      name: "Fresh Orange",
      price: 1500,
      unit: "Rwf/kg",
      discount: 10,
      rating: 5,
      badge: null,
      image: pro2,
    },
    {
      id: 3,
      name: "Fresh banana",
      price: 1500,
      unit: "Rwf/kg",
      discount: 10,
      rating: 4,
      badge: null,
      image: pro4,
    },
    {
      id: 4,
      name: "Fresh Meat",
      price: 1000,
      unit: "Rwf/kg",
      discount: 15,
      rating: 4,
      badge: "Popular",
      badgeColor: "bg-yellow-400",
      image: pro3,
    },
    {
      id: 5,
      name: "Fresh Fish",
      price: 1300,
      unit: "Rwf/kg",
      discount: 20,
      rating: 5,
      badge: null,
      image: pro5,
    },
    {
      id: 6,
      name: "Fresh pepper",
      price: 1000,
      unit: "Rwf/kg",
      discount: 25,
      rating: 4,
      badge: "Popular",
      badgeColor: "bg-yellow-400",
      image: pro6,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Register & Connect",
      description: "Get set up in minutes, creating an account and connecting with the network",
      icon: User,
    },
    {
      number: "02",
      title: "Store your produce",
      description: "Deliver your fresh produce to our cold storage facility with storage",
      icon: Package,
    },
    {
      number: "03",
      title: "Monitor in Real time",
      description: "Track temperature, humidity and quality metrics via our dashboard 24/7",
      icon: Thermometer,
    },
    {
      number: "04",
      title: "Sell & Deliver",
      description: "List items on our marketplace or fulfill orders through our logistics for delivery",
      icon: ShoppingBag,
    },
  ];

  const testimonials = [
    {
      id: 1,
      text: "Before MoFresh, our produce spoiled quickly. Now, by storing our fruits, vegetables, and meat in their cold rooms, we reduce wastage, keep quality fresh, and sell on the marketplace at better prices. MoFresh made selling easier. Customers trust us every day.",
      author: "Ben Rwagira",
      role: "Former Farmer",
      avatar: cli2,
    },
    {
      id: 2,
      text: '"Your services was incredible.the cold boxes served me better. it showed me to keep clients arrive as close as if they were in my market.I stored my to find that on the same time produce for work with MoFresh."',
      author: "Eza neza company",
      role: "client",
      avatar: cli3,
    },
  ];

  return (
    <div className="w-full bg-white">
      {/* ========== HERO SECTION WITH CAROUSEL ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 py-6 lg:py-8">
        <div className="bg-[#1a5e3f] rounded-[32px] lg:rounded-[40px] overflow-hidden relative min-h-[450px] lg:h-[600px]">
          <div className="flex flex-col lg:flex-row items-center justify-between px-8 sm:px-12 lg:px-16 py-10 lg:py-16 h-full relative z-10 gap-8 lg:gap-0">
            {/* Left Content */}
            <div className="w-full lg:w-[52%] text-white space-y-5 lg:space-y-6">
              <div className="space-y-1">
                <h1 className="leading-[1.1] font-bold">
                  <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[56px]">
                    Store <span className="text-[#8bc34a]">Smart</span>.
                  </span>
                  <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[56px]">
                    Sell <span className="text-[#8bc34a]">Better</span>.
                  </span>
                  <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-[56px]">
                    Start with <span className="text-[#8bc34a]">MoFresh</span>
                  </span>
                </h1>
              </div>

              <div className="bg-[rgba(77,116,79,0.4)] rounded-xl lg:rounded-2xl px-6 sm:px-8 lg:px-12 py-4 lg:py-5 mt-5">
                <p className="text-white text-sm sm:text-base lg:text-lg font-normal leading-relaxed">
                  Affordable cold storage and a digital marketplace to help you reduce losses and reach better buyers.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button className="bg-[#23a31f] hover:bg-[#1e8c1a] text-white font-semibold text-sm sm:text-base px-6 lg:px-8 h-12 lg:h-14 rounded-lg flex items-center justify-center gap-2 transition-all">
                  Shop Fresh Now
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
                <Button className="bg-[#23a31f] hover:bg-[#1e8c1a] text-white font-semibold text-sm sm:text-base px-6 lg:px-8 h-12 lg:h-14 rounded-lg flex items-center justify-center gap-2 transition-all">
                  Rent Now
                  <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5" />
                </Button>
              </div>
            </div>

            {/* Right Hero Carousel - 4 sliding images */}
            <div className="w-full lg:w-[45%] h-[280px] sm:h-[350px] lg:h-[480px] relative">
              <div className="relative w-full h-full overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
                {heroImages.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                      index === currentSlide
                        ? "opacity-100 translate-x-0"
                        : index < currentSlide
                        ? "opacity-0 -translate-x-full"
                        : "opacity-0 translate-x-full"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Hero ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Three Features Below Hero */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mt-8 lg:mt-10 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#1a5e3f] rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
              <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-2">Smart cold chain</h3>
            <p className="text-sm text-gray-600">Real-time temperature monitoring</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#1a5e3f] rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
              <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-2">Fast Delivery</h3>
            <p className="text-sm text-gray-600">Same-day for city zones</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-[#1a5e3f] rounded-2xl flex items-center justify-center mx-auto mb-3 lg:mb-4 shadow-lg">
              <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-base lg:text-lg mb-2">Quality Assurance</h3>
            <p className="text-sm text-gray-600">Double-checked for perfection</p>
          </div>
        </div>
      </section>

      {/* ========== SHOP BY CATEGORY ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-12 pt-12 lg:pt-16 pb-8 lg:pb-10 bg-white">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#1a5e3f] mb-2">Shop by Category</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700">
              Find products quickly by browsing through organized categories
            </p>
          </div>
          <button className="bg-white border-2 border-[#1a5e3f] rounded-xl px-5 lg:px-6 py-2.5 flex items-center gap-2 hover:bg-green-50 transition-colors whitespace-nowrap">
            <span className="text-[#1a5e3f] text-base lg:text-lg font-medium">View all</span>
            <ArrowRight className="w-4 h-4 text-[#1a5e3f]" />
          </button>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl group"
              >
                <div className="aspect-square relative bg-white">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 text-white">
                    <h3 className="text-xl lg:text-3xl font-bold drop-shadow-lg">{category.name}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Navigation Button - Desktop only */}
          <div className="hidden lg:block absolute -right-16 top-1/2 -translate-y-1/2">
            <button className="bg-[#1a5e3f] rounded-full w-14 h-14 flex items-center justify-center hover:bg-[#8bc34a] transition-all shadow-lg">
              <ArrowRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ========== LIMITED PRODUCTS ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-14">
        <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-gray-900 mb-6 lg:mb-8">Limited Products</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative">
                {product.discount && (
                  <div className="absolute top-3 left-3 bg-[#ff6b35] text-white px-3 py-1 rounded-lg text-xs font-bold z-10">
                    {product.discount}% Off
                  </div>
                )}
                {product.badge && (
                  <div className={`absolute top-3 right-3 ${product.badgeColor} text-gray-900 px-3 py-1 rounded-lg text-xs font-bold z-10`}>
                    {product.badge}
                  </div>
                )}
                <img src={product.image} alt={product.name} className="w-full h-48 sm:h-52 object-cover" />
              </div>

              <div className="p-4 lg:p-5">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-3">{product.name}</h3>

                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "fill-[#ffa500] text-[#ffa500]" : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">
                      {product.price} <span className="text-xs font-normal text-gray-600">{product.unit}</span>
                    </p>
                  </div>
                  <Button className="bg-[#fed600] hover:bg-[#e5c200] text-gray-900 rounded-full w-10 h-10 flex items-center justify-center p-0 shadow-md">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== PROMOTIONAL BANNERS ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          {/* Banner 1 - Green Vegetables */}
          <div className="bg-[#1a7a4a] rounded-[28px] p-8 lg:p-10 text-white relative overflow-hidden h-64 lg:h-72">
            <div className="absolute top-0 left-0 w-32 h-32 lg:w-40 lg:h-40 bg-[#238f5c] rounded-full -translate-x-12 lg:-translate-x-16 -translate-y-10 lg:-translate-y-12" />
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="bg-white text-[#1a7a4a] text-xs lg:text-sm font-bold px-4 py-1.5 rounded-full inline-block mb-5">
                  10% Off
                </div>
                <h3 className="text-xl lg:text-2xl font-bold leading-tight">Mofresh provided</h3>
                <h3 className="text-xl lg:text-2xl font-bold leading-tight">fresh <span className="text-white">Vegetables</span> everyday</h3>
              </div>
              <div className="absolute top-4 right-8 lg:right-12">
                <img src={of1} alt="Vegetables" className="w-40 h-40 lg:w-48 lg:h-48 object-cover rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>

          {/* Banner 2 - Orange Storage */}
          <div className="bg-[#ff7a3d] rounded-[28px] p-8 lg:p-10 text-white relative overflow-hidden h-64 lg:h-72">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold leading-tight mb-1">Big Offer</h3>
                <h3 className="text-2xl lg:text-3xl font-bold leading-tight">Open for fresh</h3>
              </div>
              <div className="absolute top-4 right-8 lg:right-12">
                <img src={of2} alt="Storage box" className="w-40 h-40 lg:w-48 lg:h-48 object-cover rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Banner 3 - Beef Meat */}
          <div className="bg-[#7a2828] rounded-[28px] p-8 lg:p-10 text-white relative overflow-hidden h-64 lg:h-72">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <div className="bg-[#ff6b35] text-white text-xs lg:text-sm font-bold px-4 py-1.5 rounded-full inline-block mb-4">
                  Hurry up! Get 20% Off
                </div>
                <h3 className="text-base lg:text-lg font-normal mb-0">Enjoy your lunch</h3>
                <h3 className="text-base lg:text-lg font-normal mb-2">with delicious</h3>
                <h3 className="text-3xl lg:text-4xl font-bold text-[#ff6b35]">Beef Meat</h3>
              </div>
              <div className="absolute bottom-6 right-8 lg:right-12">
                <img src={of3} alt="Beef meat" className="w-36 h-32 lg:w-44 lg:h-40 object-cover rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>

          {/* Banner 4 - Yellow Offer */}
          <div className="bg-[#fed600] rounded-[28px] p-8 lg:p-10 text-gray-900 relative overflow-hidden h-64 lg:h-72">
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div>
                <h3 className="text-lg lg:text-xl font-semibold leading-tight mb-0">We are willing</h3>
                <h3 className="text-lg lg:text-xl font-semibold leading-tight mb-3">to make you an offer</h3>
                <h3 className="text-5xl lg:text-6xl font-black leading-none">40% Off</h3>
              </div>
              <div className="absolute top-4 right-8 lg:right-12">
                <img src={of4} alt="Fresh produce" className="w-40 h-40 lg:w-48 lg:h-48 object-cover rounded-2xl shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SUBSCRIPTION BANNER ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-12 py-8 lg:py-10">
        <div className="bg-[#1a7a4a] rounded-2xl lg:rounded-3xl p-8 lg:p-12 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 leading-tight">
                Get 20% Cash Back every times
              </h2>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
                with a <span className="text-white">Subscription</span>
              </h2>
              <p className="text-base lg:text-lg mb-6 text-white/90">On All Shopping you do</p>
              <Button className="bg-white text-[#1a7a4a] hover:bg-gray-100 font-semibold px-8 lg:px-10 py-5 lg:py-6 rounded-lg text-base transition-all shadow-lg">
                Get Started
              </Button>
            </div>
            <div className="hidden lg:block">
              <img src={of5} alt="Fresh produce basket" className="w-72 h-64 object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW MOFRESH WORKS ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-12 py-12 lg:py-16 bg-white">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">
            How <span className="text-[#8bc34a]">MoFresh</span> works
          </h2>
          <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
            Get started in minutes, our streamlined process makes it easy to preserve, manage, and sell your agricultural products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={step.number} className="text-center relative">
                <div className="relative mb-6 flex justify-center">
                  <div className="w-20 h-20 lg:w-24 lg:h-24 bg-[#1a5e3f] rounded-3xl flex items-center justify-center text-white transform transition-all duration-300 hover:bg-[#8bc34a] shadow-lg relative">
                    <IconComponent className="w-10 h-10 lg:w-12 lg:h-12" />
                    <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#fed600] rounded-full flex items-center justify-center text-sm font-bold text-gray-900 shadow-md z-10">
                      {step.number}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-[calc(50%+48px)] w-[calc(100%+32px)] h-[2px] bg-gray-200" />
                  )}
                </div>
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section
        className="w-full py-14 lg:py-20"
        style={{
          backgroundImage: `linear-gradient(93.1deg, rgba(0, 0, 0, 0.75) 3.63%, rgba(26, 94, 63, 0.75) 99.23%), url('${cli1}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center mb-12 lg:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-2">
              Discover what <span className="text-[#fed600]">client</span> says
            </h2>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fed600] leading-tight">about us</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-[#1a5e3f] text-white rounded-2xl lg:rounded-3xl p-8 lg:p-10 transform transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <p className="text-sm lg:text-base mb-8 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-14 h-14 lg:w-16 lg:h-16 rounded-full object-cover border-4 border-[#8bc34a]"
                  />
                  <div>
                    <h4 className="font-bold text-base lg:text-lg">{testimonial.author}</h4>
                    <p className="text-sm text-white/70">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;