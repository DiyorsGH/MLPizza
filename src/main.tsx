import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/main.css";

import Checkout from "./pages/Checkout";
import ErrorPage from "./pages/ErrorPage";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")!).render(
  <Router>
    <App />
  </Router>
);