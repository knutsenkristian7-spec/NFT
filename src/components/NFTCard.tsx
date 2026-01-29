import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Gavel, TrendingUp, Eye } from 'lucide-react';
import { NFT } from '../context/NFTContext';

interface NFTCardProps {
  nft: NFT;
  showBuyButton?: boolean;
  showSaleButton?: boolean;
  showAuctionButton?: boolean;
  showBidButton?: boolean;
  showChangePrice?: boolean | undefined;
  onBuy?: () => void;
  onSale?: () => void;
  onAuction?: () => void;
  onBid?: () => void;
  onChangePrice?: () => void;
  onCancel?: () => void;
}

export const NFTCard = ({
  nft,
  showBuyButton,
  showSaleButton,
  showAuctionButton,
  showBidButton,
  showChangePrice,
  onBuy,
  onSale,
  onAuction,
  onBid,
  onChangePrice,
  onCancel,
}: NFTCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -8 }}
        className="bg-gradient-to-br from-gray-800/50 to-purple-900/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-500/20 shadow-xl hover:shadow-purple-500/20 transition-all cursor-pointer"
      >
        {/* Image Container */}
        <div 
          className="relative aspect-square overflow-hidden group"
          onClick={() => setShowDetails(true)}
        >
          <motion.img
            src={nft.image}
            alt={nft.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          
          {/* Sales Count Badge */}
          {nft.salesCount > 0 && (
            <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-bold">{nft.salesCount}</span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-2 text-white">
              <Eye className="w-5 h-5" />
              <span className="font-medium">View Details</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3" onClick={() => setShowDetails(true)}>
            <h3 className="text-xl font-bold text-white mb-1 truncate">{nft.name}</h3>
            <p className="text-gray-400 text-sm">by {nft.creator}</p>
          </div>

          {/* Price */}
          {nft.price && (
            <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-gray-400 text-xs mb-1">
                {nft.isForAuction ? 'Current Bid' : 'Price'}
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {nft.price} ETH
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {showBuyButton && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onBuy?.();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-semibold text-white transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                Buy
              </motion.button>
            )}

            {showSaleButton && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onSale?.();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold text-white transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                Sale
              </motion.button>
            )}

            {showAuctionButton && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onAuction?.();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 rounded-lg font-semibold text-white transition-all"
              >
                <Gavel className="w-4 h-4" />
                Auction
              </motion.button>
            )}

            {showBidButton && (
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  onBid?.();
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-lg font-semibold text-white transition-all"
              >
                <Gavel className="w-4 h-4" />
                Place Bid
              </motion.button>
            )}

            {showChangePrice && (
              <>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChangePrice?.();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-semibold text-white transition-all"
                >
                  Change
                </motion.button>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCancel?.();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold text-white transition-all"
                >
                  Cancel
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetails(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
            >
              <button
                onClick={() => setShowDetails(false)}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors z-10"
              >
                <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                  ✕
                </motion.div>
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Image */}
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div>
                  <h2 className="text-4xl font-bold text-white mb-2">{nft.name}</h2>
                  <p className="text-gray-400 mb-6">Created by {nft.creator}</p>

                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Description</div>
                      <p className="text-white">{nft.description}</p>
                    </div>

                    <div>
                      <div className="text-gray-400 text-sm mb-1">Owner</div>
                      <p className="text-white font-mono text-sm">
                        {nft.owner.slice(0, 8)}...{nft.owner.slice(-6)}
                      </p>
                    </div>

                    {nft.price && (
                      <div className="p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                        <div className="text-gray-400 text-sm mb-1">
                          {nft.isForAuction ? 'Current Bid' : 'Price'}
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                          {nft.price} ETH
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-gray-400 text-sm mb-1">Total Sales</div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span className="text-white font-bold">{nft.salesCount} sales</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
