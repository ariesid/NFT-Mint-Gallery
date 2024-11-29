import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import CreateNFT from "./pages/CreateNFT/CreateNFT";
import MintNFT from "./pages/MintNFT/MintNFT";
import Gallery from "./pages/Gallery/Gallery";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/nft-mint-gallery" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/create-nft" element={<CreateNFT />} />
        <Route path="/mint-nft" element={<MintNFT />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
