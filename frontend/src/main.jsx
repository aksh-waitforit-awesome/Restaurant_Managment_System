import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "./index.css"
import App from "./App.jsx"
import { QueryClient, QueryClientContext } from "@tanstack/react-query"
const queryClient = new QueryClient()
createRoot(document.getElementById("root")).render(
  <>
    <BrowserRouter>
      <QueryClientContext value={queryClient}>
        <App />
      </QueryClientContext>
    </BrowserRouter>
  </>,
)
