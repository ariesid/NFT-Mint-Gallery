import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import dark_arrow from "../../assets/dark-arrow.png";

function Home() {
  const navigate = useNavigate();

  const handleExplore = async (e) => {
    navigate("/gallery");
  };

  return (
    <>
      <div className="hero container">
        <div className="hero-text">
          <h1>We Ensure Showing Your NFT Collection</h1>
          <p>
            <p />
            Discover the world of digital art and collectibles with our curated
            NFT gallery. Explore unique creations, connect with artists, and
            celebrate the future of decentralized art.
          </p>
          <button className="btn" onClick={handleExplore}>
            Explore more <img src={dark_arrow} alt="" />
          </button>
        </div>
      </div>
    </>
  );
}

export default Home;
