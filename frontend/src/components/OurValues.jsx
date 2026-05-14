import React from "react"
import { Leaf, Truck, UtensilsCrossed, ShieldCheck } from "lucide-react" // Optional: using lucide-react for icons

const values = [
  {
    title: "Fresh Ingredients",
    description:
      "Sourced daily from local organic farms to ensure the best taste.",
    icon: <Leaf className="w-8 h-8 text-primary" />,
  },
  {
    title: "Expert Chefs",
    description:
      "Our kitchen is led by world-class chefs with a passion for flavor.",
    icon: <UtensilsCrossed className="w-8 h-8 text-primary" />,
  },
  {
    title: "Fast Delivery",
    description:
      "Hot and fresh food delivered to your doorstep in under 30 minutes.",
    icon: <Truck className="w-8 h-8 text-primary" />,
  },
  {
    title: "Quality Assured",
    description:
      "Strict hygiene and quality checks for a safe dining experience.",
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
  },
]

const OurValues = () => {
  return (
    <section className="py-16 bg-surface transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-black text-text mb-4">Why Choose Us?</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={index}
              className="p-8 rounded-3xl bg-surface border border-primary/10 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="mb-4 p-3 bg-primary/10 w-fit rounded-2xl ">
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-text mb-2">
                {value.title}
              </h3>
              <p className="text-text opacity-70 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default OurValues
