import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Clock, 
  Hash, 
  User, 
  Wallet, 
  History as HistoryIcon, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { getMarketplaceContract, getNFTContract } from '../web3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SaleRecord {
  seller: string;
  buyer: string;
  nft: string;
  tokenId: bigint;
  price: bigint;
  timestamp: bigint;
  name?: string;
  image?: string;
}

export const History = () => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaleHistory();
  }, []);

  async function loadSaleHistory() {
    try {
      const contract = await getMarketplaceContract();
      const rawSales = await contract.getSales();
      const nftContract = await getNFTContract();

      const formattedSales = await Promise.all(rawSales.map(async (s: any) => {
        let image = "";
        let name = `NFT #${s.tokenId.toString()}`;

        try {
          const tokenURI = await nftContract.tokenURI(s.tokenId);
          const response = await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'));
          const metadata = await response.json();
          image = metadata.image?.replace('ipfs://', 'https://ipfs.io/ipfs/');
          name = metadata.name || name;
        } catch (e) {
          console.error("Metadata fetch error:", e);
        }

        return {
          seller: s.seller,
          buyer: s.buyer,
          nft: s.nft,
          tokenId: s.tokenId,
          price: s.price,
          timestamp: s.timestamp,
          name,
          image
        };
      }));

      // Sort by newest first
      setSales(formattedSales.reverse());
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setLoading(false);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
      <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full mb-4" />
      <p className="text-gray-400 font-medium">Fetching Transaction History...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center gap-4 mb-12">
        <div className="p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20">
          <HistoryIcon className="w-8 h-8 text-purple-400" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Marketplace Activity</h1>
          <p className="text-gray-400">Verifiable blockchain transaction history</p>
        </div>
      </div>

      {sales.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/20 rounded-3xl border border-dashed border-gray-700">
          <p className="text-gray-500 text-lg">No sales recorded yet.</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {sales.map((sale, idx) => (
            <motion.div
              key={`${sale.tokenId}-${idx}`}
              variants={cardVariants}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -20px rgba(168, 85, 247, 0.4)" }}
              className="relative group bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden flex flex-col"
            >
              {/* Animated Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/10 blur-[80px] group-hover:bg-purple-600/20 transition-all duration-500" />
              
              {/* Image Section */}
              <div className="aspect-square w-full p-4">
                <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black/40 relative">
                  <ImageWithFallback src={sale.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                    <span className="text-white font-bold text-sm">{ethers.formatEther(sale.price)} ETH</span>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 pt-0 space-y-6 flex-grow">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{sale.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Clock className="w-3 h-3" />
                      {new Date(Number(sale.timestamp) * 1000).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                    <Hash className="w-3 h-3" /> Token ID: {sale.tokenId.toString()}
                  </p>
                </div>

                {/* Transfer View */}
                <div className="bg-white/5 rounded-3xl p-5 space-y-4 border border-white/5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] text-gray-500 uppercase font-black mb-1">Seller</span>
                      <span className="text-sm text-gray-300 font-mono truncate">{sale.seller}</span>
                    </div>
                    <div className="bg-purple-500/20 p-2 rounded-full">
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex flex-col text-right overflow-hidden">
                      <span className="text-[10px] text-pink-500 uppercase font-black mb-1">Buyer</span>
                      <span className="text-sm text-gray-300 font-mono truncate">{sale.buyer}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Link */}
              <div className="p-4 border-t border-white/5 bg-white/5 flex justify-center">
                <button className="text-xs text-gray-400 hover:text-white flex items-center gap-2 transition-colors">
                  View on Etherscan <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};