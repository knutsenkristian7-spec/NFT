import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X } from "lucide-react";
import { ethers } from "ethers";
import { useNFT } from "../context/NFTContext";
import { NFTCard } from "./NFTCard";

import { MARKETPLACE_ADDRESS, NFT_ADDRESS } from "../constants";

// 🔥 IMPORT YOUR REAL ABI JSON FILES
import MARKETPLACE_ABI from "../abis/Marketplace.json";
import NFT_ABI from "../../backend/artifacts/contracts/NFT.sol/NFT.json";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const MyNFTs = () => {
  const { nfts, walletAddress, listNFTForSale, listNFTForAuction } = useNFT();
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [salePrice, setSalePrice] = useState("");
  const [auctionPrice, setAuctionPrice] = useState("");
  const [auctionDuration, setAuctionDuration] = useState("24");
  const [loading, setLoading] = useState(false);

  const myNFTs = nfts.filter(
    (nft) =>
      nft.owner.toLowerCase() === walletAddress.toLowerCase() &&
      !nft.isForSale &&
      !nft.isForAuction,
  );

  const handleSale = (nft: any) => {
    setSelectedNFT(nft);
    setShowSaleModal(true);
  };

  const handleAuction = (nft: any) => {
    setSelectedNFT(nft);
    setShowAuctionModal(true);
  };

  const confirmSale = async () => {
    if (!selectedNFT || !salePrice) return;

    try {
      setLoading(true);

      if (!window.ethereum) {
        alert("MetaMask not found");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      if (!selectedNFT.contractAddress) {
        console.error("NFT contractAddress is missing:", selectedNFT);
        alert("NFT contract address is missing. Check NFT data.");
        return;
      }

      console.log("Marketplace Contract Address:", MARKETPLACE_ADDRESS);
      console.log("NFT Contract Address:", selectedNFT.contractAddress);

      // 🔥 Create contract instances DIRECTLY
      const marketplace = new ethers.Contract(
        MARKETPLACE_ADDRESS,
        MARKETPLACE_ABI,
        signer,
      );

      const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI.abi, signer);

      const tokenId = selectedNFT.tokenId || selectedNFT.id;
      const priceInWei = ethers.parseEther(salePrice);

      console.log("========== LIST NFT DEBUG ==========");
      console.log("Marketplace Contract Address:", MARKETPLACE_ADDRESS);
      console.log("NFT Contract Address:", selectedNFT.contractAddress);
      console.log("Token ID:", tokenId);
      console.log("Sale Price (ETH):", salePrice);
      console.log("Price in Wei:", priceInWei.toString());
      console.log("Wallet Address:", await signer.getAddress());
      console.log("===================================");
      
      console.log("DEBUG tokenId:", tokenId);

      const owner = await nftContract.ownerOf(tokenId);

      console.log("OWNER OF TOKEN:", owner);
      console.log("CONNECTED WALLET:", walletAddress);

      console.log("Approving NFT...");
      const approveTx = await nftContract.approve(MARKETPLACE_ADDRESS, tokenId);
      await approveTx.wait();

      console.log("Listing item on marketplace...");
      const listTx = await marketplace.listItem(
        selectedNFT.contractAddress,
        tokenId,
        priceInWei,
      );
      await listTx.wait();

      console.log("✅ NFT listed successfully!");

      setShowSaleModal(false);
      setSalePrice("");
      setSelectedNFT(null);
    } catch (error) {
      console.error("❌ List item failed:", error);
      if (error instanceof Error) {
        console.error("Full error object:", error);
        alert(`Error: ${error.message}`); // Display the error message
      } else {
        console.error("Unknown error:", error);
        alert(
          "An unknown error occurred. Please check the console for more details.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmAuction = () => {
    if (selectedNFT && auctionPrice && auctionDuration) {
      const endTime = Date.now() + parseInt(auctionDuration) * 60 * 60 * 1000;
      listNFTForAuction(selectedNFT, parseFloat(auctionPrice), endTime);
      setShowAuctionModal(false);
      setAuctionPrice("");
      setAuctionDuration("24");
      setSelectedNFT(null);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-4 border border-purple-500/30">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-300 text-sm">Your Collection</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            My NFTs
          </h1>
          <p className="text-gray-400 text-lg">
            Manage and list your digital collectibles
          </p>
        </motion.div>

        {/* NFT Grid */}
        {myNFTs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No NFTs Yet</h3>
            <p className="text-gray-400">
              Create your first NFT to get started
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myNFTs.map((nft) => (
              <NFTCard
                key={nft.id}
                nft={nft}
                showSaleButton
                showAuctionButton
                onSale={() => handleSale(nft)}
                onAuction={() => handleAuction(nft.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sale Modal */}
      <AnimatePresence>
        {showSaleModal && selectedNFT && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSaleModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-3xl shadow-2xl max-w-md w-full border border-purple-500/30 p-8"
            >
              <button
                onClick={() => setShowSaleModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">
                List NFT for Sale
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sale Price (ETH)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="0.1"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <motion.button
                onClick={confirmSale}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-bold text-white transition-all"
              >
                {loading ? "Listing..." : "Confirm Sale"}
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auction Modal */}
      <AnimatePresence>
        {showAuctionModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuctionModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-3xl shadow-2xl max-w-md w-full border border-purple-500/30 p-8"
            >
              <button
                onClick={() => setShowAuctionModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">
                List NFT for Auction
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Starting Bid (ETH)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={auctionPrice}
                    onChange={(e) => setAuctionPrice(e.target.value)}
                    placeholder="Enter starting bid"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Auction Duration (hours)
                  </label>
                  <input
                    type="number"
                    value={auctionDuration}
                    onChange={(e) => setAuctionDuration(e.target.value)}
                    placeholder="Enter duration"
                    className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <motion.button
                onClick={confirmAuction}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl font-bold text-white transition-all"
              >
                Start Auction
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
