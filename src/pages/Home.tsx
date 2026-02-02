import AboutUs from '@/components/AboutUs'
import { HeroSection } from '@/components/HeroSection'
import { TopNavBar } from '@/components/TopNavBar'


function Home() {
  return (
    <>
      <TopNavBar />
      <HeroSection />
      <AboutUs />
    </>
  )
}

export default Home