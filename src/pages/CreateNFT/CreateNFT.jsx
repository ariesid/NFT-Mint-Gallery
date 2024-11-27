import React, { useState, useEffect } from "react";
import "./CreateNFT.css";
import { ethers } from "ethers";
import contract_icon from "../../assets/nft_contract.png";
import NFTCollection from "../../artifacts/contracts/nft_collection_flattened.sol/NFTCollection.json";

function CreateNFT() {
  const [etherPrice, setEtherPrice] = useState(null);
  const [error, setError] = useState(null);
  const [nftName, setNftName] = useState();
  const [nftSymbol, setNftSymbol] = useState();
  const [nftDesc, setNftDesc] = useState();
  const [nftContract, setNftContract] = useState(null);
  // const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetchEtherPrice();
  }, []);

  const nftNameChange = (event) => {
    setNftName(event.target.value);
  };

  const nftSymbolChange = (event) => {
    setNftSymbol(event.target.value);
  };

  const nftDescChange = (event) => {
    setNftDesc(event.target.value);
  };

  const fetchEtherPrice = async () => {
    try {
      console.log("fetchEtherPrice");
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
      );
      const data = await response.json();
      setEtherPrice(data.ethereum.usd);
    } catch (err) {
      setError("Failed to fetch Ether price. Please try again later.");
      console.error(err);
    }
  };

  const deployNFT = async () => {
    try {
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

      // Deploy the contract
      const factory = new ethers.ContractFactory(
        NFTCollection.abi,
        NFTCollection.bytecode,
        signer
      );

      setNftContract(null);
      setError(null);
      console.log("Starting deploy process...");
      console.log(nftName, nftSymbol, nftDesc);
      // console.log("nftName: ", nftName);
      // console.log("nftSymbol: ", nftSymbol);
      // console.log("nftDesc: ", nftDesc);
      const contract = await factory.deploy(
        nftName,
        nftSymbol
        // { gasLimit: 3000000 }
      );

      console.log("Trx hash:", contract.deploymentTransaction.hash);
      console.log("Contract deployed at:", contract.target);
      setNftContract(contract.target);

      const txHash = contract.deploymentTransaction().hash;
      console.log("Deployment Transaction Hash:", txHash);

      console.log("Confirmed!");
    } catch (error) {
      setError(error.message);
      console.log("error: ", error.message);
    }
  };

  return (
    <div>
      <div className="title">
        <h1>CREATE NFT</h1>
      </div>
      <div className="createnft">
        <div className="createnft-col">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter NFT Name, eg: Art Tokens"
            required
            onChange={nftNameChange}
          />
          <label>Symbol</label>
          <input
            type="text"
            name="aymbol"
            placeholder="Enter NFT Symbol, eg: ARTO"
            required
            onChange={nftSymbolChange}
          />
          <button type="button" className="btn dark-btn" onClick={deployNFT}>
            Create NFT
          </button>
        </div>

        <div className="createnft-col">
          <h3>
            NFT Address <img src={contract_icon} alt="" />
          </h3>
          <div className="createnft-font1">
            <h4>
              {nftContract !== null ? (
                <p>{nftContract}</p>
              ) : (
                <p>NFT Address Not Available</p>
              )}
            </h4>
          </div>

          <p>
            Please copy the Contract Address and save it in your safe documents.
            You will need it when you want to mint NFT and show your collection.
          </p>

          <div>
            <h1>Ethereum Price</h1>
            {etherPrice !== null ? (
              <p>Current Ether Price: ${etherPrice.toFixed(2)} USD</p>
            ) : (
              <p>Loading...</p>
            )}
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNFT;
