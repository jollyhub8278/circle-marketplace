import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SellProduct from "./pages/SellProduct";
import ProductDetail from "./pages/ProductDetail";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/sell" element={<SellProduct />} />

        <Route path="/listing/:id" element={<ProductDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
