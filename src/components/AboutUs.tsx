import Harvest from "../assets/AboutHarvest.jpg";
import HarvestInBox from "../assets/AbtHarvestInBox.jpeg";
import { Snowflake, Users, TrendingUp, BarChart } from "lucide-react";
const AboutUs = () => {
  return (
    <>
      <section className="p-6 sm:p-8 md:p-12 bg-[#e3fae9]">
        <div className="text-center font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-6">
          <h1>About Us</h1>
        </div>
        <div className="text-center">
          <div className="bg-green-600 h-1 w-16 sm:w-20 md:w-24  mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 -m-4 sm:-m-6 md:-m-10 mt-8 sm:mt-10 md:mt-12">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="m-2 sm:m-4 md:m-10 rounded-2xl sm:rounded-3xl md:rounded-4xl">
              <img
                src={Harvest}
                alt="About Us Image 1"
                className="h-full rounded-2xl sm:rounded-3xl md:rounded-4xl"
              />
            </div>

            <div className="rounded-2xl sm:rounded-3xl md:rounded-4xl">
              <img
                src={HarvestInBox}
                alt="About Us Image 2"
                className="rounded-2xl sm:rounded-3xl md:rounded-4xl"
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-6 md:mt-0">
            <div className="text-[#3b5241]">
              <h1 className="text-center font-semibold text-2xl sm:text-3xl md:text-4xl">
                Connecting Farmers to Markets <br className="hidden sm:block" />
                with Cold Chain Technology
              </h1>
              <div className="bg-green-600 h-1 w-48 sm:w-64 md:w-72 lg:w-80 mx-auto rounded-full m-4 sm:m-6"></div>
              <ul className="ml-4 sm:ml-6 md:ml-8 lg:ml-30 text-lg sm:text-xl md:text-2xl gap-4">
                <li className="flex items-center mb-3 sm:mb-4">
                  <Snowflake
                    className="mr-2 text-green-600 flex-shrink-0"
                    size={24}
                  />
                  <span>
                    Facilitates reliable cold storage solutions for perishable
                    agricultural products.
                  </span>
                </li>
                <li className="flex items-center mb-3 sm:mb-4">
                  <Users
                    className="mr-2 text-green-600 flex-shrink-0"
                    size={24}
                  />
                  <span>
                    Connects farmers, cooperatives, and buyers through a
                    real-time digital marketplace.
                  </span>
                </li>
                <li className="flex items-center mb-3 sm:mb-4">
                  <TrendingUp
                    className="mr-2 text-green-600 flex-shrink-0"
                    size={24}
                  />
                  <span>
                    Minimizes post-harvest losses while enhancing farmer income
                    and market access.
                  </span>
                </li>
                <li className="flex items-center mb-3 sm:mb-4">
                  <BarChart
                    className="mr-2 text-green-600 flex-shrink-0"
                    size={24}
                  />
                  <span>
                    Provides comprehensive tracking of inventory, sales, and
                    market trends.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
export default AboutUs;
