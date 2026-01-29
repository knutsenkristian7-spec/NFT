import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNFT } from '../context/NFTContext';

export const PopularNFTs = () => {
  const { nfts } = useNFT();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Get top 10 NFTs by sales count
  const popularNFTs = [...nfts]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 10);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollPosition = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  if (popularNFTs.length === 0) return null;

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full mb-4 border border-red-500/30">
            <Flame className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm">Trending Now</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent mb-4">
            Popular NFTs
          </h2>
          <p className="text-gray-400 text-lg">
            Top selling digital collectibles today
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {popularNFTs.length > 4 && (
            <>
              <motion.button
                onClick={() => scroll('left')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </motion.button>
              <motion.button
                onClick={() => scroll('right')}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-purple-600 hover:bg-purple-700 rounded-full shadow-lg transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </motion.button>
            </>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {popularNFTs.map((nft, index) => (
              <motion.div
                key={nft.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="flex-shrink-0 w-80 bg-gradient-to-br from-gray-800/50 to-purple-900/30 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-500/20 shadow-xl hover:shadow-purple-500/30 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Ranking Badge */}
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <TrendingUp className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-bold">#{index + 1}</span>
                  </div>

                  {/* Sales Count */}
                  <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white text-xs font-bold">{nft.salesCount} sales</span>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-1 truncate">{nft.name}</h3>
                  <p className="text-gray-400 text-sm mb-3">by {nft.creator}</p>

                  {nft.price && (
                    <div className="flex items-center justify-between p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                      <span className="text-gray-400 text-sm">Price</span>
                      <span className="text-purple-400 font-bold">{nft.price} ETH</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Scroll Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {popularNFTs.map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-purple-500/50"
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
