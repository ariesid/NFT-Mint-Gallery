import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
// import { discdata } from "../../constants";
import NFTCollection from "../../artifacts/contracts/nft_collection_flattened.sol/NFTCollection.json";
import eth2 from "../../assets/eth2.png";
import "./Gallery.css";

const NftCard = ({
  meta: {
    name,
    description,
    image,
    trait0,
    value0,
    trait1,
    value1,
    trait2,
    value2,
  },
}) => (
  <div className="gallery_card">
    <div className="gallery_card_head">
      <img className="nft__images" src={image} alt="NFT Images" />
    </div>
    <div className="gallery_card_description">
      <h1 className="h2__font1">{name}</h1>
      <div className="description_bid">
        <div className="bid">
          <img src={eth2} alt="Etherum Icon" />
          <p className="p__font1">{value2}</p>
        </div>
        <p className="p__font1 amount">{value1}</p>
      </div>
    </div>
    <div className="gallery_card_times">
      <p className="p__font1">{description}</p>
      <a href="#">Place a bid</a>
    </div>
  </div>
);
function Gallery() {
  const [error, setError] = useState(null);
  const [trxReceipt, setTrxReceipt] = useState();
  const [nftAddress, setNftAddress] = useState("");
  // const [nftName, setNftName] = useState();
  // const [nftDesc, setNftDesc] = useState();
  // const [nftImageUrl, setNftImageUrl] = useState();
  // const [nftArtwork, setNftArtwork] = useState();
  // const [nftCreator, setNftCreator] = useState();
  const [nftData, setNftData] = useState([]);

  const nftAddressChange = (event) => {
    setNftAddress(event.target.value);
  };

  const fetchNFT = async () => {
    const itemArray = [];
    setError(null);
    let receiptLog = "Preparing view NFT... ";
    setTrxReceipt(receiptLog);

    try {
      // Ensure Ethereum provider exists and is MetaMask
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error(
          "MetaMask is not installed or detected. Please install MetaMask."
        );
      }

      // const nftAddress = "0xd8c22f2a128C2Dcc467b47BC1199C536D81cCc2E";

      // Connect Wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      // const signer = await provider.getSigner();
      console.log("Wallet Connected");
      // console.log("account: ", myAccount);

      const nftContract = new ethers.Contract(
        nftAddress,
        NFTCollection.abi,
        provider
      );

      const totalSupply = await nftContract.totalSupply();
      console.log("Total NFTs: ", totalSupply.toString());

      const allNFTs = [];
      const itemArray = [];

      for (let i = 0; i < totalSupply; i++) {
        const tokenId = await nftContract.tokenByIndex(i); // Get token ID
        const owner = await nftContract.ownerOf(tokenId); // Get owner
        const tokenURI = await nftContract.tokenURI(tokenId); // Get metadata URI
        allNFTs.push({ tokenId: tokenId.toString(), owner, tokenURI });

        const meta = await axios.get(tokenURI);
        // console.log("metadata: ", meta);
        const metaName = await meta.data.name;
        // console.log("name: ", metaName);
        const metaDesc = await meta.data.description;
        // console.log("desc: ", metaDesc);
        let metaImg = "";
        try {
          metaImg = await meta.data.image.replace(
            "ipfs://",
            "https://gateway.pinata.cloud/ipfs/"
          );
          // console.log("metaImg: ", metaImg);
        } catch (error) {
          console.log("error: ", error);
        }

        const trait0 = await meta.data.attributes[0].trait_type;
        const value0 = await meta.data.attributes[0].value;
        // console.log("[attr] ", trait0, ": ", value0);

        const trait1 = await meta.data.attributes[1].trait_type;
        const value1 = await meta.data.attributes[1].value;
        // console.log("[attr] ", trait1, ": ", value1);

        const trait2 = await meta.data.attributes[2].trait_type;
        const value2 = await meta.data.attributes[2].value;
        // console.log("[attr] ", trait1, ": ", value1);

        const nft = {
          id: tokenId,
          name: metaName,
          description: metaDesc,
          image: metaImg,
          trait0: trait0,
          value0: value0,
          trait1: trait1,
          value1: value1,
          trait2: trait2,
          value2: value2,
        };
        itemArray.push(nft);
      }
      // console.log("allNFTs: ", allNFTs);
      console.log("itemArray: ", itemArray);
      setNftData(itemArray);

      console.log("Fetch NFT done!");
    } catch (error) {
      setError(error.message);
      console.log("error: ", error);
    }
  };

  return (
    <div className="gallery">
      <div className="gallery-head">
        <h1 className="h1__font2">SHOW YOUR NFTs</h1>
        <br />
        <label>NFT Address</label>
        <input
          type="text"
          name="nftaddrees"
          placeholder="Enter NFT Address, eg: 0xc34d5992f52811B90135080048Ba9D55042Ac46a"
          required
          class="resizedTextbox"
          onChange={nftAddressChange}
        />
        <button className="btn dark-btn" onClick={fetchNFT}>
          Load NFTs
        </button>
        <ul>
          <li className="color__purple">
            <a href="#">All Categories</a>
          </li>
          <li>
            <a href="#">Art</a>
          </li>
          <li>
            <a href="#">Celebrities</a>
          </li>
          <li>
            <a href="#">Gaming</a>
          </li>
          <li>
            <a href="#">Sport</a>
          </li>
          <li>
            <a href="#">Music</a>
          </li>
          <li>
            <a href="#">Crypto</a>
          </li>
        </ul>
      </div>
      <div className="gallery-content">
        {/* {discdata.discovers.map((discover) => (
            <DiscoverCard discover={discover} key={discover.title} />
          ))} */}
        {nftData.map((discover) => (
          <NftCard meta={discover} key={discover.id} />
        ))}
      </div>
    </div>
  );
}

export default Gallery;
