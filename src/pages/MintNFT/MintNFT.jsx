import React, { useState, useEffect } from "react";
import "./MintNFT.css";
import { ethers } from "ethers";
import nft_cards from "../../assets/albert-einstein-warrior_cards.png";
import NFTCollection from "../../artifacts/contracts/nft_collection_flattened.sol/NFTCollection.json";

function MintNFT() {
  const [nftAddress, setNftAddress] = useState(null);
  const [nftName, setNftName] = useState();
  const [nftDesc, setNftDesc] = useState();
  const [nftImageUrl, setNftImageUrl] = useState();
  const [nftCategory, setNftCategory] = useState();
  const [nftCreator, setNftCreator] = useState();
  const [nftPrice, setNftPrice] = useState();
  const [trxReceipt, setTrxReceipt] = useState();

  useEffect(() => {
    setValue();
  }, []);

  const nftAddressChange = (event) => {
    setNftAddress(event.target.value);
  };

  const nftNameChange = (event) => {
    setNftName(event.target.value);
  };

  const nftDescChange = (event) => {
    setNftDesc(event.target.value);
  };

  const nftImageUrlChange = (event) => {
    setNftImageUrl(event.target.value);
  };

  const nftCategoryChange = (event) => {
    setNftCategory(event.target.value);
  };

  const nftCreatorChange = (event) => {
    setNftCreator(event.target.value);
  };

  const nftPriceChange = (event) => {
    setNftPrice(event.target.value);
  };

  const setValue = async () => {
    setNftAddress("0xc34d5992f52811B90135080048Ba9D55042Ac46a");
    setNftName("Einstein In Yellow");
    setNftDesc("He has yellow hair");
    setNftImageUrl(
      "ipfs://QmfLCEYmM5dLozRaAJfDebffeyWhGx68CGs1CZtWgbCq9j/Albert_Einstein_1.jpg"
    );
    setNftCategory("Einstein Funky");
    setNftCreator("Jennifer Brown");
    setNftPrice("0.025");
  };

  const mintingNFT = async () => {
    try {
      let receiptLog = "Preparing minting process... ";
      setTrxReceipt(receiptLog);

      // Ensure Ethereum provider exists and is MetaMask
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw new Error(
          "MetaMask is not installed or detected. Please install MetaMask."
        );
      }

      // Connect Wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log("Wallet Connected");

      const nftContract = new ethers.Contract(
        nftAddress,
        NFTCollection.abi,
        signer
      );

      const tx = await nftContract.mintNfts(
        nftName,
        nftDesc,
        nftImageUrl,
        nftCategory,
        nftCreator,
        nftPrice
      );
      receiptLog = receiptLog + "\nTransaction sent: " + tx.hash;
      receiptLog = receiptLog + "\n\n Waiting confirmations...";
      setTrxReceipt(receiptLog);

      console.log("Transaction sent:", tx.hash);

      // const receipt = await tx.wait();
      const receipt = `Transaction Receipt:\n ${JSON.stringify(
        await tx.wait(),
        null,
        2
      )}`;
      receiptLog = receiptLog + "\n\n" + receipt;
      setTrxReceipt(receiptLog);
      // Display the transaction receipt details
      console.log("Transaction Receipt:", receipt);

      console.log("Confirmed!");
    } catch (error) {
      console.log("error: ", error.message);
    }
  };

  return (
    <div>
      <div className="title">
        <h1 className="h1__font2">MINT NFT</h1>
      </div>
      <div className="mintnft">
        <div className="mintnft-col">
          <label>NFT Address</label>
          <input
            type="text"
            name="nftaddrees"
            placeholder="Enter NFT Contract, eg: 0xc34d5992f52811B90135080048Ba9D55042Ac46a"
            value={nftAddress}
            required
            onChange={nftAddressChange}
          />
          <label>NFT Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter NFT Name, eg: Funny Monster"
            value={nftName}
            required
            onChange={nftNameChange}
          />
          <label>Description</label>
          <input
            type="text"
            name="desc"
            placeholder="Enter Image URL, eg: Funny Monster is looking for love"
            value={nftDesc}
            required
            onChange={nftDescChange}
          />
          <label>Category</label>
          <input
            type="text"
            name="category"
            placeholder="Enter the Category, eg: Funny Character"
            value={nftCategory}
            required
            onChange={nftCategoryChange}
          />
          <label>Creator</label>
          <input
            type="text"
            name="creator"
            placeholder="Enter Creator, eg: Iron Black"
            value={nftCreator}
            required
            onChange={nftCreatorChange}
          />
          <label>Price ETH</label>
          <input
            type="text"
            name="price"
            placeholder="Enter Price ETH, eg: 0.25"
            value={nftPrice}
            required
            onChange={nftPriceChange}
          />
          <label>Image URL</label>
          <input
            type="text"
            name="imgurl"
            placeholder="Enter Image URL, eg: ipfs://QmW3yT4hKAer3KDfSriiQcu2Zno6fLodmxyaAyYT2eFRyf/MotoGP2023.png"
            value={nftImageUrl}
            required
            onChange={nftImageUrlChange}
          />
          <button type="button" className="btn dark-btn" onClick={mintingNFT}>
            Mint NFT
          </button>

          <textarea
            name="receipt"
            rows="6"
            readOnly="true"
            value={trxReceipt}
          ></textarea>
        </div>

        <div className="mintnft-col">
          <img src={nft_cards} alt="" />
        </div>
      </div>
    </div>
  );
}

export default MintNFT;
