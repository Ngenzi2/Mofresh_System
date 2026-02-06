import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import farmerImage from "@/assets/AboutHarvest.jpg";
import basketImage from "@/assets/AbtHarvestInBox.jpeg";
import teamImage from "@/assets/Hero.jpg";

function AboutPage() {
  const { t } = useTranslation();

  const features = [
    t('aboutFeature1') || "Direct farm-to-business connections",
    t('aboutFeature2') || "Quality assurance on every order",
    t('aboutFeature3') || "Real-time tracking and updates"
  ];

  return (
    <div className="bg-gradient-to-b from-[#f9fdf7] to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Fresh gradient with image overlay */}
      <div className="relative bg-gradient-to-br from-[#157954] via-[#21263A] to-[#157954] text-white py-24 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={teamImage}
            alt={t('aboutTeamImageAlt') || "Team meeting"}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#157954]/80 via-[#21263A]/70 to-[#157954]/80" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-bold mb-6"
          >
            {t('aboutUsTitle') || 'About Us'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-sm text-gray-200"
          >
            <a href="/" className="hover:text-[#D0D34D] transition-colors">
              {t('home') || 'Home'}
            </a>{" "}
            <span className="mx-2">→</span>{" "}
            <span className="text-[#D0D34D] font-medium">
              {t('aboutUs') || 'About Us'}
            </span>
          </motion.p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Top Section - Images and About MoFresh */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Left side - Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-6"
          >
            {/* Farmer with vegetables */}
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl overflow-hidden h-full shadow-xl"
            >
              <img
                src={farmerImage}
                alt={t('aboutFarmerImageAlt') || "Farmer with fresh produce"}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="grid grid-rows-2 gap-6">
              {/* Basket with vegetables */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: -2 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl overflow-hidden shadow-xl"
              >
                <img
                  src={basketImage}
                  alt={t('aboutBasketImageAlt') || "Fresh vegetables in basket"}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              {/* Active clients card */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-[#157954] to-[#21263A] rounded-3xl flex flex-col items-center justify-center text-white p-6 shadow-xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-5xl font-bold mb-2"
                >
                  50+
                </motion.div>
                <div className="text-sm">{t('activeClients') || 'active clients'}</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right side - About content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-[#e8f5e9] to-[#D0D34D]/20 dark:from-gray-800 dark:to-gray-700 rounded-3xl p-12 shadow-xl"
          >
            <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-4 font-medium uppercase tracking-wider">
              {t('aboutMofreshLabel') || 'About MoFresh'}
            </h3>
            <h2 className="text-5xl font-bold mb-8 leading-tight">
              {t('aboutMofreshHeading1') || 'Store fresh. Sell smart.'}
              <br />
              <span className="text-[#157954] dark:text-[#52b788]">
                {t('aboutMofreshHeading2') || 'Grow more'}
              </span> {t('aboutMofreshHeading3') || 'with MoFresh.'}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-12 leading-relaxed text-lg">
              {t('aboutMofreshDescription') || 'MoFresh is an integrated cold chain and agricultural marketplace platform designed to support small-scale farmers and food vendors'}
            </p>

            {/* Features list with connected circles */}
            <div className="space-y-0 relative">
              {/* Vertical connecting line */}
              <div className="absolute left-6 top-6 bottom-6 w-1 bg-gradient-to-b from-[#157954] to-[#D0D34D]"></div>

              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 * index }}
                  className="flex items-start gap-5 relative pb-10 last:pb-0"
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-br from-[#157954] to-[#D0D34D] text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-sm font-bold relative z-10 shadow-lg"
                  >
                    0{index + 1}
                  </motion.div>
                  <div className="pt-3">
                    <p className="text-gray-800 dark:text-gray-200 font-medium text-lg">
                      {feature}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Vision, Mission, History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left side - Vision, Mission, History cards */}
          <div className="space-y-8">
            {/* Our vision */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 border-2 border-[#157954]/20 dark:border-gray-700 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all"
            >
              <button className="border-2 border-[#157954] dark:border-[#52b788] text-[#157954] dark:text-[#52b788] rounded-full px-8 py-3 text-sm font-semibold mb-6 hover:bg-[#157954] hover:text-white dark:hover:bg-[#52b788] dark:hover:text-white transition-colors">
                {t('ourVision') || 'Our vision'}
              </button>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {t('visionDescription') || 'MoFresh is an integrated cold chain and agricultural marketplace platform designed to support small-scale farmers and food vendors'}
              </p>
            </motion.div>

            {/* Our Mission */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 border-2 border-[#157954]/20 dark:border-gray-700 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all"
            >
              <button className="border-2 border-[#157954] dark:border-[#52b788] text-[#157954] dark:text-[#52b788] rounded-full px-8 py-3 text-sm font-semibold mb-6 hover:bg-[#157954] hover:text-white dark:hover:bg-[#52b788] dark:hover:text-white transition-colors">
                {t('ourMission') || 'Our Mission'}
              </button>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {t('missionDescription') || 'MoFresh is an integrated cold chain and agricultural marketplace platform designed to support small-scale farmers and food vendors'}
              </p>
            </motion.div>

            {/* Our History */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#157954] to-[#21263A] text-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all"
            >
              <button className="border-2 border-[#D0D34D] text-[#D0D34D] rounded-full px-8 py-3 text-sm font-semibold mb-6 hover:bg-[#D0D34D] hover:text-[#157954] transition-colors">
                {t('ourHistory') || 'Our History'}
              </button>
              <p className="text-white leading-relaxed text-lg">
                {t('historyDescription') || 'MoFresh is an integrated cold chain and agricultural marketplace platform designed to support small-scale farmers and food vendors'}
              </p>
            </motion.div>
          </div>

          {/* Right side - Large image card with overlay text */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl overflow-hidden min-h-[700px] shadow-2xl"
          >
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={teamImage}
                alt={t('aboutTeamCollab') || "Team collaboration"}
                className="w-full h-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#157954]/90 via-[#157954]/70 to-[#D0D34D]/60"></div>
            </div>

            {/* Content */}
            <div className="relative h-full p-14 flex flex-col justify-between">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <h2 className="text-6xl font-bold text-white mb-4 leading-tight">
                  {t('aboutSlogan1') || 'Fresh produce.'}
                </h2>
                <h2 className="text-6xl font-bold text-white mb-4 leading-tight">
                  {t('aboutSlogan2') || 'Smarter'}
                </h2>
                <h2 className="text-6xl font-bold mb-10 leading-tight">
                  <span className="text-[#D0D34D]">
                    {t('aboutSlogan3') || 'storage.'}
                  </span>{" "}
                  <span className="text-white">{t('aboutSlogan4') || 'Better'}</span>
                </h2>
                <h2 className="text-6xl font-bold text-white leading-tight">
                  {t('aboutSlogan5') || 'markets.'}
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-[#D0D34D] to-[#D0D34D]/80 text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-all"
                >
                  {t('contactUsButton') || 'contact us'}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;