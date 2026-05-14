import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import { useNavigate } from "react-router-dom"
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"

const banners = [
  {
    id: 1,
    title: "Reserve Your Spot",
    subtitle: "Planning a dinner date? Book a table in seconds.",
    image: "/register.jpg",
    cta: "Book Table",
    color: "from-green-900/80",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Explore our chef's special seasonal menu.",
    image: "/login.jpg",
    cta: "View Menu",
    color: "from-orange-900/80",
  },
]

const BannerSlider = () => {
  const navigate = useNavigate()
  return (
    <div className="w-full h-[400px] md:h-[500px] mb-8  overflow-hidden shadow-xl">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={800}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="h-full w-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative w-full h-full">
              {/* Background Image */}
              <img
                src={banner.image}
                className="absolute inset-0 w-full h-full object-cover"
                alt={banner.title}
              />

              {/* Overlay Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${banner.color} to-transparent flex items-center`}
              >
                <div className="px-8 md:px-16 max-w-2xl text-white">
                  <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 opacity-90">
                    {banner.subtitle}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate("/menu")}
                      className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-all transform hover:scale-105"
                    >
                      {banner.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default BannerSlider
