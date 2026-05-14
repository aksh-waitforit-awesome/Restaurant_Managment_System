import { createContext, useContext, useState, useEffect } from "react"
const themeContext = createContext()
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark")
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark", "theme-luxury")
    root.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])
  return (
    <themeContext.Provider value={{ setTheme, theme }}>
      {children}
    </themeContext.Provider>
  )
}
export const useTheme = () => useContext(themeContext)
