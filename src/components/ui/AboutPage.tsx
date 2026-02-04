// Import your images here - replace these paths with your actual image paths
import farmerImage from "@/assets/AboutHarvest.jpg";
import basketImage from "@/assets/AbtHarvestInBox.jpeg";
import teamImage from "@/assets/Hero.jpg";

function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section - Dark green with image overlay */}
      <div className="relative bg-[#1B4332] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src={teamImage}
            alt="Team meeting"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-4">About Us</h1>
          <p className="text-sm text-gray-200">
            <a href="#/" className="hover:text-white">
              Home
            </a>{" "}
            <span className="mx-2">→</span>{" "}
            <span className="text-white font-medium">
              About Us
            </span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section - Images and About MoFresh */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left side - Images */}
          <div className="grid grid-cols-2 gap-4">
            {/* Farmer with vegetables */}
            <div className="rounded-3xl overflow-hidden h-full">
              <img
                src={farmerImage}
                alt="Farmer with fresh produce"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-rows-2 gap-4">
              {/* Basket with vegetables */}
              <div className="rounded-3xl overflow-hidden">
                <img
                  src={basketImage}
                  alt="Fresh vegetables in basket"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Active clients card */}
              <div className="bg-[#2D6A4F] rounded-3xl flex flex-col items-center justify-center text-white p-6">
                <div className="text-4xl font-bold mb-1">
                  50+
                </div>
                <div className="text-sm">active clients</div>
              </div>
            </div>
          </div>

          {/* Right side - About content */}
          <div className="bg-[#D8E9E1] rounded-3xl p-10">
            <h3 className="text-sm text-gray-600 mb-3 font-medium">
              About MoFresh
            </h3>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Store fresh. Sell smart.
              <br />
              Grow more with MoFresh.
            </h2>
            <p className="text-gray-700 mb-10 leading-relaxed">
              MoFresh is an integrated cold chain and
              agricultural marketplace platform designed to
              support small-scale farmers and food vendors
            </p>

            {/* Features list with connected circles */}
            <div className="space-y-0 relative">
              {/* Vertical connecting line */}
              <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-[#2D6A4F]"></div>

              <div className="flex items-start gap-4 relative pb-8">
                <div className="bg-[#2D6A4F] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-sm font-semibold relative z-10">
                  01
                </div>
                <div className="pt-2">
                  <p className="text-gray-800 font-medium">
                    Direct farm-to-business connections
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative pb-8">
                <div className="bg-[#2D6A4F] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-sm font-semibold relative z-10">
                  02
                </div>
                <div className="pt-2">
                  <p className="text-gray-800 font-medium">
                    Quality assurance on every order
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 relative">
                <div className="bg-[#2D6A4F] text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 text-sm font-semibold relative z-10">
                  03
                </div>
                <div className="pt-2">
                  <p className="text-gray-800 font-medium">
                    Real-time tracking and updates
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision, Mission, History Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Vision, Mission, History cards */}
          <div className="space-y-6">
            {/* Our vision */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8">
              <button className="border-2 border-gray-800 rounded-full px-6 py-2 text-sm font-medium mb-4">
                Our vision
              </button>
              <p className="text-gray-700 leading-relaxed">
                MoFresh is an integrated cold chain and
                agricultural marketplace platform designed to
                support small-scale farmers and food vendors
              </p>
            </div>

            {/* Our Mission */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8">
              <button className="border-2 border-gray-800 rounded-full px-6 py-2 text-sm font-medium mb-4">
                Our Mission
              </button>
              <p className="text-gray-700 leading-relaxed">
                MoFresh is an integrated cold chain and
                agricultural marketplace platform designed to
                support small-scale farmers and food vendors
              </p>
            </div>

            {/* Our History */}
            <div className="bg-[#2D6A4F] text-white rounded-3xl p-8">
              <button className="border-2 border-white rounded-full px-6 py-2 text-sm font-medium mb-4">
                Our History
              </button>
              <p className="text-white leading-relaxed">
                MoFresh is an integrated cold chain and
                agricultural marketplace platform designed to
                support small-scale farmers and food vendors
              </p>
            </div>
          </div>

          {/* Right side - Large image card with overlay text */}
          <div className="relative rounded-3xl overflow-hidden min-h-[600px]">
            {/* Background image */}
            <div className="absolute inset-0">
              <img
                src={teamImage}
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
              {/* Green overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#52B788]/90 to-[#74C69D]/80"></div>
            </div>

            {/* Content */}
            <div className="relative h-full p-12 flex flex-col justify-between">
              <div>
                <h2 className="text-5xl font-bold text-white mb-3 leading-tight">
                  Fresh produce.
                </h2>
                <h2 className="text-5xl font-bold text-white mb-3 leading-tight">
                  Smarter
                </h2>
                <h2 className="text-5xl font-bold mb-8 leading-tight">
                  <span className="text-[#FFD166]">
                    storage.
                  </span>{" "}
                  <span className="text-white">Better</span>
                </h2>
                <h2 className="text-5xl font-bold text-white leading-tight">
                  markets.
                </h2>
              </div>

              <div className="flex justify-end">
                <button className="bg-[#FFD166] text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-[#ffc933] transition-colors">
                  contact us
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;