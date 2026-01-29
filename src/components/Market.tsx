import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Edit2, Trash2, Check, X, Tag, Wallet, Hash } from 'lucide-react';
import { getMarketplaceContract, getNFTContract, getSigner } from '../web3';
import { useNFT } from '../context/NFTContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Listing {
  seller: string;
  price: bigint;
  nft: string;
  tokenId: bigint;
  originalIndex: number;
  image?: string;
  name?: string;
  description?: string;
}

export const Market = () => {
  const { walletConnected } = useNFT();
  const [userAccount, setUserAccount] = useState<string>('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);
  const [selectedNFT, setSelectedNFT] = useState<Listing | null>(null);
  const [editingPrice, setEditingPrice] = useState<{ id: number; value: string } | null>(null);

  useEffect(() => {
    loadListings();
    if (walletConnected) {
      getSigner().then(signer => signer.getAddress()).then(addr => setUserAccount(addr));
    }
  }, [walletConnected]);


  async function loadListings() {
    try {
      const contract = await getMarketplaceContract();
      const allListings = await contract.getAllListings();
      const nftContract = await getNFTContract();
      
      const formattedListings = await Promise.all(allListings.map(async (item: any, idx: number) => {
        let image = "", name = `NFT #${item.tokenId.toString()}`, description = "No description available.";
        try {
          const tokenURI = await nftContract.tokenURI(item.tokenId);
          const response = await fetch(tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/'));
          const metadata = await response.json();
          image = metadata.image?.replace('ipfs://', 'https://ipfs.io/ipfs/');
          name = metadata.name || name;
          description = metadata.description || description;
        } catch (e) { console.error(e); }

        return { seller: item.seller, price: item.price, nft: item.nft, tokenId: item.tokenId, originalIndex: idx, image, name, description };
      }));
      setListings(formattedListings);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function handleBuy(e: React.MouseEvent, index: number, price: bigint) {
    e.stopPropagation();
    if (!walletConnected) return alert("Connect wallet");
    setActionId(index);
    try {
      const contract = await getMarketplaceContract(true);
      const tx = await contract.buyItem(index, { value: price });
      await tx.wait();
      await loadListings();
      setSelectedNFT(null);
    } catch (e) { console.error(e); } finally { setActionId(null); }
  }

  async function handleCancel(e: React.MouseEvent, index: number) {
    e.stopPropagation();
    if (!confirm("Cancel this listing?")) return;
    setActionId(index);
    try {
      const contract = await getMarketplaceContract(true);
      const tx = await contract.cancelListing(index);
      await tx.wait();
      await loadListings();
      setSelectedNFT(null);
    } catch (e) { console.error(e); } finally { setActionId(null); }
  }

  async function handleUpdatePrice(e: React.MouseEvent, index: number) {
    e.stopPropagation();
    if (!editingPrice?.value) return;
    setActionId(index);
    try {
      const contract = await getMarketplaceContract(true);
      const tx = await contract.updatePrice(index, ethers.parseEther(editingPrice.value));
      await tx.wait();
      setEditingPrice(null);
      await loadListings();
    } catch (e) { console.error(e); } finally { setActionId(null); }
  }

  if (loading) return <div className="text-center py-20 text-white italic">Loading Market...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-white mb-12">Marketplace</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {listings.map((item) => {
            const isOwner = userAccount.toLowerCase() === item.seller.toLowerCase();
            const isEditing = editingPrice?.id === item.originalIndex;

            return (
              <motion.div
                key={`${item.nft}-${item.tokenId}`}
                layoutId={`card-${item.nft}-${item.tokenId}`}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedNFT(item)}
                className="bg-gray-800/50 backdrop-blur-md rounded-2xl border border-purple-500/20 overflow-hidden cursor-pointer group hover:border-purple-500/50 transition-all"
              >
                <div className="aspect-square w-full overflow-hidden bg-gray-900 border-b border-white/5">
                  <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="text-lg font-bold text-white truncate">{item.name}</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 uppercase">Price</span>
                      <span className="text-white font-bold">{ethers.formatEther(item.price)} ETH</span>
                    </div>

                    {isOwner ? (
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setEditingPrice({id: item.originalIndex, value: ""}); }} className="p-2 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-lg">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleCancel(e, item.originalIndex)} className="p-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button onClick={(e) => handleBuy(e, item.originalIndex, item.price)} disabled={actionId !== null} className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold">
                        {actionId === item.originalIndex ? "Buying..." : "Buy Now"}
                      </button>
                    )}
                  </div>

                  {isEditing && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-2 p-2 mt-2 bg-gray-900 rounded-lg border border-blue-500/30" onClick={(e) => e.stopPropagation()}>
                      <input className="bg-transparent text-white text-sm outline-none flex-1" placeholder="New Price" value={editingPrice.value} onChange={(e) => setEditingPrice({...editingPrice, value: e.target.value})} autoFocus />
                      <button onClick={(e) => handleUpdatePrice(e, item.originalIndex)} className="text-green-400"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditingPrice(null)} className="text-gray-500"><X className="w-4 h-4" /></button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Enlarged Modal */}
      <AnimatePresence>
        {selectedNFT && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedNFT(null)} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div layoutId={`card-${selectedNFT.nft}-${selectedNFT.tokenId}`} className="relative w-full max-w-5xl bg-gray-900 border border-white/10 rounded-[32px] overflow-hidden flex flex-col md:flex-row">
              <button onClick={() => setSelectedNFT(null)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-white"><X className="w-6 h-6" /></button>
              <div className="w-full md:w-1/2 aspect-square p-8 bg-black flex items-center justify-center">
                <ImageWithFallback src={selectedNFT.image} alt={selectedNFT.name} className="w-full h-full object-contain" />
              </div>
              <div className="p-10 md:w-1/2 flex flex-col justify-between">
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-white">{selectedNFT.name}</h2>
                  <p className="text-gray-400 text-lg leading-relaxed">{selectedNFT.description}</p>
                  <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-4"><Wallet className="text-purple-400" /><div><p className="text-[10px] text-gray-500 uppercase">Seller</p><p className="text-sm text-gray-300 font-mono truncate">{selectedNFT.seller}</p></div></div>
                </div>
                <div className="pt-8 border-t border-white/10 flex items-center justify-between">
                  <div><p className="text-gray-500 text-sm">Price</p><p className="text-3xl font-bold text-white">{ethers.formatEther(selectedNFT.price)} ETH</p></div>
                  {userAccount?.toLowerCase() !== selectedNFT.seller.toLowerCase() && <button onClick={e => handleBuy(e, selectedNFT.originalIndex, selectedNFT.price)} className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold flex items-center gap-3"><ShoppingCart className="w-5 h-5" /> Buy NFT</button>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};