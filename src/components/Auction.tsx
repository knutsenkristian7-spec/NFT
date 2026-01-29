import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gavel, Clock, Trophy, X, TrendingUp } from 'lucide-react';
import { useNFT, NFT } from '../context/NFTContext';

export const Auction = () => {
  const { nfts, walletAddress, placeBid, finalizeAuction } = useNFT();
  const [showBidModal, setShowBidModal] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  const auctionNFTs = nfts.filter(nft => nft.isForAuction);

  // Update time every second for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (endTime: number) => {
    const remaining = endTime - currentTime;
    if (remaining <= 0) return 'Auction Ended';

    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleBid = (nft: NFT) => {
    setSelectedNFT(nft);
    setBidAmount((nft.currentBid ? nft.currentBid + 0.01 : 0.01).toString());
    setShowBidModal(true);
  };

  const confirmBid = () => {
    if (selectedNFT && bidAmount) {
      const amount = parseFloat(bidAmount);
      if (selectedNFT.currentBid && amount <= selectedNFT.currentBid) {
        alert('Bid must be higher than current bid');
        return;
      }
      placeBid(selectedNFT.id, amount);
      setShowBidModal(false);
      setBidAmount('');
      setSelectedNFT(null);
    }
  };

  const handleFinalize = (nftId: string) => {
    if (window.confirm('Confirm auction winner and transfer NFT?')) {
      finalizeAuction(nftId);
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 rounded-full mb-4 border border-orange-500/30">
            <Gavel className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 text-sm">Live Auctions</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-4">
            NFT Auctions
          </h1>
          <p className="text-gray-400 text-lg">
            Place your bids and win exclusive NFTs
          </p>
        </motion.div>

        {/* Auction List */}
        {auctionNFTs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gavel className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Active Auctions</h3>
            <p className="text-gray-400">Check back later for new auctions</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {auctionNFTs.map((nft) => {
              const isOwner = nft.owner.toLowerCase() === walletAddress.toLowerCase();
              const isEnded = nft.auctionEndTime && nft.auctionEndTime <= currentTime;
              const timeRemaining = nft.auctionEndTime ? formatTimeRemaining(nft.auctionEndTime) : '';

              return (
                <motion.div
                  key={nft.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-gray-800/50 to-orange-900/30 backdrop-blur-xl rounded-3xl overflow-hidden border border-orange-500/20 shadow-xl"
                >
                  <div className="grid md:grid-cols-3 gap-6 p-6">
                    {/* NFT Image */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden group">
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {nft.salesCount > 0 && (
                        <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                          <TrendingUp className="w-3 h-3 text-white" />
                          <span className="text-white text-xs font-bold">{nft.salesCount}</span>
                        </div>
                      )}
                    </div>

                    {/* NFT Info & Bids */}
                    <div className="md:col-span-2 flex flex-col">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h2 className="text-3xl font-bold text-white mb-2">{nft.name}</h2>
                            <p className="text-gray-400">by {nft.creator}</p>
                          </div>
                          
                          <div className={`px-4 py-2 rounded-full ${
                            isEnded ? 'bg-red-500/20 border-red-500/30' : 'bg-orange-500/20 border-orange-500/30'
                          } border`}>
                            <div className="flex items-center gap-2">
                              <Clock className={`w-4 h-4 ${isEnded ? 'text-red-400' : 'text-orange-400'}`} />
                              <span className={`text-sm font-medium ${isEnded ? 'text-red-400' : 'text-orange-400'}`}>
                                {timeRemaining}
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-6">{nft.description}</p>

                        {/* Current Bid */}
                        <div className="bg-orange-500/10 rounded-2xl p-6 border border-orange-500/20 mb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-gray-400 text-sm mb-1">Current Bid</div>
                              <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                                {nft.currentBid || 0} ETH
                              </div>
                              {nft.highestBidder && (
                                <div className="text-gray-400 text-sm mt-2">
                                  Highest bidder: {nft.highestBidder.slice(0, 8)}...{nft.highestBidder.slice(-6)}
                                </div>
                              )}
                            </div>

                            {!isOwner && !isEnded && (
                              <motion.button
                                onClick={() => handleBid(nft)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl font-bold text-white transition-all shadow-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <Gavel className="w-5 h-5" />
                                  Place Bid
                                </div>
                              </motion.button>
                            )}

                            {isOwner && isEnded && nft.highestBidder && (
                              <motion.button
                                onClick={() => handleFinalize(nft.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl font-bold text-white transition-all shadow-lg"
                              >
                                <div className="flex items-center gap-2">
                                  <Trophy className="w-5 h-5" />
                                  Finalize
                                </div>
                              </motion.button>
                            )}
                          </div>
                        </div>

                        {/* Bid History */}
                        {nft.bids && nft.bids.length > 0 && (
                          <div>
                            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                              <Trophy className="w-5 h-5 text-yellow-400" />
                              Bid History
                            </h3>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {[...nft.bids].reverse().map((bid, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
                                      {index + 1}
                                    </div>
                                    <span className="text-gray-300 text-sm font-mono">
                                      {bid.bidder.slice(0, 8)}...{bid.bidder.slice(-6)}
                                    </span>
                                  </div>
                                  <div className="text-orange-400 font-bold">{bid.amount} ETH</div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bid Modal */}
      <AnimatePresence>
        {showBidModal && selectedNFT && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBidModal(false)}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-gradient-to-br from-gray-900 to-orange-900/50 rounded-3xl shadow-2xl max-w-md w-full border border-orange-500/30 p-8"
            >
              <button
                onClick={() => setShowBidModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-300" />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6">Place Your Bid</h2>

              <div className="mb-6">
                <div className="mb-4 p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                  <div className="text-gray-400 text-sm mb-1">Current Bid</div>
                  <div className="text-2xl font-bold text-orange-400">
                    {selectedNFT.currentBid || 0} ETH
                  </div>
                </div>

                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Bid (ETH)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder="Enter bid amount"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-orange-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />
                <p className="text-gray-500 text-xs mt-2">
                  Minimum bid: {selectedNFT.currentBid ? (selectedNFT.currentBid + 0.01).toFixed(2) : '0.01'} ETH
                </p>
              </div>

              <motion.button
                onClick={confirmBid}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-xl font-bold text-white transition-all"
              >
                Confirm Bid
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
