const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Section */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">Curry Chapter</h3>
          <p className="text-sm leading-relaxed">
            Crafting unforgettable culinary experiences since 2010. We use only
            the freshest locally sourced ingredients.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Hours of Operation</h4>
          <ul className="text-sm space-y-2">
            <li>Mon - Thu: 11am - 10pm</li>
            <li>Fri - Sat: 11am - 11pm</li>
            <li>Sunday: 10am - 9pm</li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="text-white font-semibold mb-4">Find Us</h4>
          <p className="text-sm mb-2">123 Gourmet Ave, Foodie City</p>
          <p className="text-sm mb-4">+1 (555) 123-4567</p>
          <div className="flex space-x-4"></div>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs">
        <p>
          &copy; {new Date().getFullYear()} FlavorBase Restaurant. All rights
          reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
