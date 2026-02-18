import { useState, useEffect } from "react";
import { Trans } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addToCart } from "@/store/cartSlice";

import { ArrowRight, Star, Plus, Thermometer, Package, User, ShoppingBag, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "./button";

// --- Types ---
interface Category {
  id: number;
  name: string;
  image: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  discount: number;
  rating: number;
  badge: string | null;
  badgeColor?: string;
  image: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
}

interface Testimonial {
  id: number;
  text: string;
  author: string;
  role: string;
  avatar: string;
}

// Hero images
import Hero1 from "@/assets/hero-1.png";
import Hero2 from "@/assets/hero-2.png";
import Hero3 from "@/assets/hero-3.png";
import Hero4 from "@/assets/hero-4.png";

// Category images
import cat1 from "@/assets/vegetables.png";
import cat2 from "@/assets/meat.png";
import cat3 from "@/assets/fruits.png";
import cat4 from "@/assets/freezer.png";

// Product images
import pro1 from "@/assets/brocoli.png";
import pro2 from "@/assets/orange.png";
import pro3 from "@/assets/freshmeat.png";
import pro4 from "@/assets/banana.png";
import pro5 from "@/assets/fish.png";
import pro6 from "@/assets/pepper.png";

// Offer pictures 
import of1 from "@/assets/10.png";
import of2 from "@/assets/20.png";
import of3 from "@/assets/40.png";
import of4 from "@/assets/offer.png";
import of5 from "@/assets/getstarted.png";

// Client images
import cli1 from "@/assets/clients.png";
import cli2 from "@/assets/client-1.png";
import cli3 from "@/assets/client-2.png";

// Farmer image
import farmerImage from "@/assets/farmer.png";

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  /* ---------- STATE ---------- */
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [page, setPage] = useState<number>(0);

  const heroImages: string[] = [Hero1, Hero2, Hero3, Hero4];

  /* ---------- CAROUSEL LOGIC ---------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  /* ---------- DATA ---------- */
  const categories: Category[] = [

    { id: 1, name: t('vegetables'), image: cat1 },
    { id: 2, name: t('meat'), image: cat2 },
    { id: 3, name: t('fruits'), image: cat3 },
    { id: 4, name: t('freezingBoxes'), image: cat4 },

  ];

  const testimonials: Testimonial[] = [
    { id: 1, text: t("testimonial1Text"), author: t("testimonial1Name"), role: t("testimonial1Role"), avatar: cli2 },
    { id: 2, text: t("testimonial2Text"), author: t("testimonial2Name"), role: t("testimonial2Role"), avatar: cli3 },
    { id: 3, text: t("testimonial3Text"), author: t("testimonial3Name"), role: t("testimonial3Role"), avatar: farmerImage },
  ];

  const groups: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += 2) {
    groups.push(testimonials.slice(i, i + 2));
  }

  useEffect(() => {
    const i = setInterval(() => {
      setPage((p) => (p + 1) % groups.length);
    }, 5000);
    return () => clearInterval(i);
  }, [groups.length]);

  const products: Product[] = [
    { id: 1, name: t('broccoli'), price: 1000, unit: "Rwf/kg", discount: 15, rating: 4, badge: t('popular'), badgeColor: "bg-black text-white", image: pro1 },
    { id: 2, name: t('orange'), price: 1500, unit: "Rwf/kg", discount: 10, rating: 5, badge: null, image: pro2 },
    { id: 3, name: t('banana'), price: 1500, unit: "Rwf/kg", discount: 10, rating: 4, badge: null, image: pro4 },
    { id: 4, name: t('meatProduct'), price: 1000, unit: "Rwf/kg", discount: 15, rating: 4, badge: t('popular'), badgeColor: "bg-black text-white", image: pro3 },
    { id: 5, name: t('fishProduct'), price: 1300, unit: "Rwf/kg", discount: 20, rating: 5, badge: null, image: pro5 },
    { id: 6, name: t('pepperProduct'), price: 1000, unit: "Rwf/kg", discount: 25, rating: 4, badge: t('popular'), badgeColor: "bg-black text-white", image: pro6 },
  ];

  const steps: Step[] = [
    { number: "01", title: t('step1Title'), description: t('step1Desc'), icon: User },
    { number: "02", title: t('step2Title'), description: t('step2Desc'), icon: Package },
    { number: "03", title: t('step3Title'), description: t('step3Desc'), icon: Thermometer },
    { number: "04", title: t('step4Title'), description: t('step4Desc'), icon: ShoppingBag },
  ];

  const handleAddToCart = (product: Product) => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  const handleAddToWishlist = (product: Product) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    toast.success(`${product.name} added to wishlist!`);
  };

  return (
    <div className="w-full bg-transparent transition-colors">

      {/* ========== ENHANCED HERO SECTION ========== */}
      <div className=" ">
        <section className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-4 lg:py-6 pb-4 lg:pb-6 relative">
          {/* problem */}
          <div
            className="relative   rounded-[40px] lg:rounded-[20px] overflow-hidden  border border-gray-200 dark:border-gray-800 transition-all duration-700"
            style={{
              backgroundImage: `url(${farmerImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center 15%',

            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-[#2d6a4f]/20 to-transparent dark:from-black/80 dark:via-gray-900/40" />

            <div className="relative z-10 px-6 sm:px-12 lg:px-16 py-8 lg:py-16 flex flex-col justify-center h-full min-h-[450px] lg:min-h-[600px]">
              <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="space-y-4">

                  <h1 className="text-3xl sm:text-4xl lg:text-[64px] font-black leading-[1.1] lg:leading-[0.95] text-white tracking-tighter">
                    {t('heroTitle1')} <span className="text-[#2E8B2E] italic">{t('heroTitle2')}</span><br />
                    {t('heroTitle3')} <span className="text-[#2E8B2E] italic">{t('heroTitle4')}</span><br />
                    <span className="text-white">{t('heroTitle5')} </span><span className="text-[#2E8B2E]">{t('heroTitle6')}</span>
                  </h1>
                </div>

                <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 lg:p-6 max-w-lg">
                  <p className="text-white/90 text-base lg:text-lg font-medium leading-relaxed">
                    {t('heroDescription')}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link to="/login" className="group bg-[#2E8B2E] hover:bg-[#257325] text-white font-bold text-lg px-8 h-14 rounded-xl flex items-center gap-3 transition-all hover:-translate-y-1 shadow-lg shadow-green-900/20">
                    {t('shopFreshNow')}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/50 text-white font-bold text-lg px-8 h-14 rounded-xl flex items-center gap-3 transition-all hover:-translate-y-1">
                    {t('rentNow')}
                  </Link>
                </div>
              </div>
            </div>

            {/* Floating Carousel Box (Bottom Right / Center on mobile) */}
            <div className="absolute bottom-6 right-4 lg:right-16 w-[200px] sm:w-[280px] h-[280px] sm:h-[380px] bg-white/10 backdrop-blur-md border border-white/20 rounded-[24px] lg:rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-1000 delay-300">
              <div className="relative w-full h-full">
                {heroImages.map((img, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {/* Gradient overlay for better text visibility if needed */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                ))}

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {heroImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide ? "w-8 bg-[#9be15d]" : "w-2 bg-white/50 hover:bg-white"
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>




          {/* Three Features Below Hero */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-12 mt-8 lg:mt-12 max-w-6xl mx-auto ">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#2d6a4f] dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-all group-hover:scale-110 group-hover:bg-[#9be15d]">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-2">{t('Smart ColdChain')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('Real Time Monitoring')}</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#2d6a4f] dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-all group-hover:scale-110 group-hover:bg-[#9be15d]">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-2">{t('Fast Delivery')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('Same Day Delivery')}</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#2d6a4f] dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 transition-all group-hover:scale-110 group-hover:bg-[#9be15d]">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg mb-2">{t('Quality Assurance')}</h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{t('Double Checked')}</p>
            </div>
          </div>

        </section>
      </div>

      {/* ========== SHOP BY CATEGORY ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 ">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#2d6a4f] dark:text-[#9be15d] mb-2">{t('Shop By Category')}</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300">{t('Categories Description')}</p>
          </div>
          <Link to="/view-all" className="border-2 border-[#2d6a4f] dark:border-[#9be15d] rounded-xl px-6 py-2.5 flex items-center gap-2 hover:bg-green-50 dark:hover:bg-gray-800 transition-colors">
            <span className="text-[#2d6a4f] dark:text-[#9be15d] font-bold">{t('viewAll')}</span>
            <ArrowRight className="w-5 h-5 text-[#2d6a4f] dark:text-[#9be15d]" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group relative rounded-[32px] overflow-hidden cursor-pointer border border-gray-100 dark:border-gray-800 aspect-square">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold">{category.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== FEATURED PRODUCTS ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 py-16">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#2d6a4f] dark:text-[#9be15d]">{t('featuredProducts')}</h2>
          <Link to="/view-all" className="text-[#2d6a4f] dark:text-[#9be15d] font-bold flex items-center gap-2">{t('viewAll')} <ArrowRight className="w-5 h-5" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700 group relative">
              <button
                onClick={() => handleAddToWishlist(product)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur-sm rounded-full hover:bg-white text-gray-500 hover:text-red-500 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </button>

              <div className="relative h-64 overflow-hidden bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                {product.badge && <div className={`absolute top-4 left-4 ${product.badgeColor} text-gray-900 px-4 py-1.5 rounded-full text-xs font-bold`}>{product.badge}</div>}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 dark:text-white">{product.name}</h3>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-black text-[#2d6a4f] dark:text-[#9be15d]">{product.price.toLocaleString()} Rwf</p>
                    <p className="text-sm text-gray-500">{product.unit}</p>
                  </div>
                  <Button onClick={() => handleAddToCart(product)} className="w-12 h-12 rounded-full bg-[#2E8B2E] hover:bg-black transition-all">
                    <Plus className="w-6 h-6 text-white" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== PROMOTIONAL BANNERS (AS PER IMAGE) ========== */}
      {/* ========== PROMOTIONAL BANNERS (AS PER IMAGE) ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Banner 1: Main Green */}
          <div className="lg:col-span-2 relative h-[360px] bg-gradient-to-br from-[#2E8B2E] to-[#1a5c1a] rounded-[32px] overflow-hidden p-8 lg:p-12 text-white group border border-white/10 shadow-xl">
            {/* Design Elements */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-black/10 rounded-full blur-2xl translate-y-1/4 -translate-x-1/4" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

            <div className="relative z-10 flex flex-col h-full">
              <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold px-3 py-1.5 rounded-lg w-fit mb-6 text-sm uppercase tracking-wider">
                10% {t('off')}
              </span>
              <div className="max-w-[60%]">
                <h3 className="text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight">
                  {t('mofreshProvided')} <br />
                  <span className="text-[#9be15d] inline-block mt-2">{t('freshVegetables')}</span>
                  <span className="block text-2xl font-medium mt-2 opacity-90">{t('everyday')}</span>
                </h3>
              </div>
            </div>
            <img src={of1} className="absolute right-0 bottom-0 w-[320px] lg:w-[480px] object-contain transition-transform duration-700 group-hover:scale-105" alt="Veg" />
          </div>

          {/* Banner 2: Same Green (was Black) */}
          <div className="relative h-[360px] bg-gradient-to-bl from-[#2E8B2E] to-[#1E5D1E] rounded-[32px] overflow-hidden p-8 text-white group border border-white/10 shadow-lg">
            {/* Design Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border border-white/10 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] border border-white/5 rounded-full" />

            <div className="relative z-10 text-right h-full flex flex-col items-end">
              <p className="text-5xl font-black text-[#9be15d] uppercase italic tracking-tighter mb-1">{t('bigOffer')}</p>
              <p className="text-xl font-bold text-white/90">{t('openForFresh')}</p>
              <div className="mt-auto bg-white/10 backdrop-blur-sm p-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors cursor-pointer" onClick={() => navigate('/login')}>
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
            </div>
            <img src={of4} className="absolute left-6 bottom-6 w-[180px] transition-transform duration-500 group-hover:-translate-y-4 group-hover:rotate-6" alt="Box" />
          </div>

          {/* Banner 3: Same Green (was White) */}
          <div className="relative h-[360px] bg-gradient-to-t from-[#2E8B2E] to-[#257325] rounded-[32px] overflow-hidden p-8 text-white group border border-white/10 shadow-lg cursor-pointer" onClick={() => navigate('/login')}>
            {/* Design Elements */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#9be15d]/20 rounded-full blur-2xl" />

            <div className="relative z-10 flex flex-col h-full">
              <div>
                <p className="text-[#9be15d] font-bold mb-2 uppercase tracking-widest text-xs">{t('hurryUp')}</p>
                <h3 className="text-3xl font-bold leading-tight max-w-[70%]">{t('enjoyLunch')} </h3>
              </div>
              <div className="mt-auto">
                <span className="inline-flex items-center gap-2 text-sm font-bold border-b border-white/50 pb-1 group-hover:border-white transition-colors">Shop Now <ArrowRight className="w-4 h-4" /></span>
              </div>
            </div>
            <img src={of2} className="absolute -right-4 bottom-0 w-[220px] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3" alt="Meat" />
          </div>

          {/* Banner 4: Same Green (was Dark Green) */}
          <div className="lg:col-span-2 relative h-[360px] bg-gradient-to-tr from-[#1a5c1a] to-[#2E8B2E] rounded-[32px] overflow-hidden p-8 lg:p-12 text-white group border border-white/10 shadow-xl">
            {/* Design Elements */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <h3 className="text-3xl lg:text-5xl font-black max-w-[50%] text-white leading-tight tracking-tight">{t('willingOffer')}</h3>

              <div className="flex items-end gap-4">
                <p className="text-6xl font-black italic text-[#9be15d] leading-none">40%</p>
                <span className="text-2xl font-bold mb-2">{t('off')}</span>
              </div>
            </div>
            <img src={of3} className="absolute right-8 top-1/2 -translate-y-1/2 w-[320px] lg:w-[400px] transition-transform duration-700 group-hover:scale-105 group-hover:rotate-2" alt="Fruits" />
          </div>
        </div>
      </section>

      {/* ========== SUBSCRIPTION BANNER ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 py-10">
        <div className="bg-[#2E8B2E] rounded-[40px] p-10 lg:p-20 text-white relative overflow-hidden group border border-white/5">
          <div className="relative z-10 max-w-2xl space-y-6">

            <h2 className="text-4xl font-bold leading-tight">
              <Trans i18nKey="cashbackDescription" components={{ br: <br /> }} />
            </h2>
            <p className="text-xl opacity-90 ">{t("onAllShopping")}</p>
            <Link to="/login" className="bg-white text-black font-bold px-10 h-16 rounded-4xl gap-2 inline-flex items-center hover:bg-black hover:text-white transition-all shadow-lg">
              {t('Get Started')} <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
          <img src={of5} className="absolute top-0 right-0 h-full w-1/3 object-cover opacity-50 lg:opacity-100 transition-transform group-hover:scale-105" alt="Basket" />
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="w-full max-w-[1728px] mx-auto px-4 sm:px-8 lg:px-16 py-20">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl lg:text-5xl font-black dark:text-white">
            {t('how MofreshWorks')} <span className="text-[#2E8B2E]">{t('heroTitle6')}</span> {t('howItWorks')}
          </h2>

        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center relative group">
                <div className="w-24 h-24 bg-[#2E8B2E] dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-8 relative group-hover:bg-black transition-all border border-white/5">
                  <Icon className="w-12 h-12 text-white" />
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-black dark:bg-white rounded-full flex items-center justify-center font-black text-white dark:text-black text-lg border-4 border-white dark:border-gray-900">{step.number}</div>
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========== TESTIMONIALS SLIDER ========== */}
      <section
        className="py-12 md:py-24 relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,.9), rgba(0,0,0,.9)), url(${cli1})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 overflow-hidden">
          {/* -------- SLIDER CONTAINER -------- */}
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {groups.map((group, i) => (
              // -------- EACH SLIDE --------
              <div
                key={i}
                className="w-full flex-shrink-0 grid md:grid-cols-2 gap-6 md:gap-10 px-0 sm:px-2 md:px-4"
              >
                {group.map((t) => (
                  // -------- EACH TESTIMONIAL CARD --------
                  <div
                    key={t.id}
                    className="bg-white/5 backdrop-blur-lg p-6 md:p-10 rounded-[24px] md:rounded-[40px] text-white border border-white/10"
                  >
                    <p className="text-base md:text-lg italic mb-6 md:mb-8 leading-relaxed">"{t.text}"</p>
                    <div className="flex items-center gap-4 md:gap-6">
                      <img
                        src={t.avatar}
                        className="w-12 h-12 md:w-16 md:h-16 rounded-full border-2 border-[#2E8B2E]"
                        alt={t.author}
                      />
                      <div>
                        <h4 className="font-black text-lg md:text-xl">{t.author}</h4>
                        <p className="text-[#2E8B2E] font-medium text-sm md:text-base">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  );
};

export default HeroSection;