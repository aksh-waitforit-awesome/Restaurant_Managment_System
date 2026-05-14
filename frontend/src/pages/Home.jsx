import React from "react"
import BannerSlider from "../components/BannerSlider"
import { useNavigate } from "react-router-dom"
import { useGetCategories } from "../react-query/queriesAndMutations" // Import your menu service
import OurValues from "../components/OurValues"
import useCategoryStore from "../store/useCategoryStore"
const HomePage = () => {
  const navigate = useNavigate()
  const { setSelectedCategory } = useCategoryStore()
  function handleCategoryClick(categoryId) {
    setSelectedCategory(categoryId)
    navigate("/menu")
  }
  // Fetch Categories
  const { data: categories } = useGetCategories()

  return (
    <div className="min-h-screen bg-surface">
      {/* 1. Hero Section */}
      <section className="w-full">
        <BannerSlider />
      </section>

      {/* 2. Quick Category Selection */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-text">
              Explore Categories
            </h2>
            <p className="opacity-70 text-text">
              Pick your favorite mood for today
            </p>
          </div>
          <button
            onClick={() => navigate("/menu")}
            className="text-primary font-bold hover:underline"
          >
            Full Menu →
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories?.slice(0, 6).map((cat) => (
            <div
              onClick={() => handleCategoryClick(cat._id)}
              key={cat._id}
              className="cursor-pointer bg-accent border border-primary/10 rounded-2xl p-6 text-center hover:bg-primary/10 transition-all hover:border-primary/30"
            >
              <img
                src={cat.icon}
                alt={cat.name}
                className="w-16 h-16 mx-auto rounded-full object-cover mb-3 group-hover:scale-110 transition-transform"
              />
              <h3 className="font-bold text-text">{cat.name}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Values Section */}
      <OurValues />
    </div>
  )
}

export default HomePage
