import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {  NFT_ADDRESS } from "../constants";

export interface NFT {
  id: string;
  tokenId: string; 
  name: string;
  creator: string;
  contractAddress: string;
  description: string;
  image: string;
  owner: string;
  price?: number;
  isForSale: boolean;
  isForAuction: boolean;
  auctionEndTime?: number;
  currentBid?: number;
  highestBidder?: string;
  bids?: { bidder: string; amount: number; time: number }[];
  salesCount: number;
  createdAt: number;
}

export interface Transaction {
  id: string;
  nftId: string;
  nftName: string;
  buyer: string;
  seller: string;
  price: number;
  timestamp: number;
}

interface NFTContextType {
  nfts: NFT[];
  transactions: Transaction[];
  walletConnected: boolean;
  walletAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  createNFT: (nft: Omit<NFT, 'id' | 'owner' | 'salesCount' | 'createdAt' | 'tokenId'>,tokenId: string ) => void;
  listNFTForSale: (nftId: string, price: number) => void;
  listNFTForAuction: (nftId: string, startingBid: number, endTime: number) => void;
  buyNFT: (nftId: string) => void;
  placeBid: (nftId: string, amount: number) => void;
  cancelListing: (nftId: string) => void;
  updateNFTPrice: (nftId: string, newPrice: number) => void;
  finalizeAuction: (nftId: string) => void;
}

const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const useNFT = () => {
  const context = useContext(NFTContext);
  if (!context) throw new Error('useNFT must be used within NFTProvider');
  return context;
};

// Sample NFTs for initial display
const sampleNFTs: NFT[] = [ ];

export const NFTProvider = ({ children }: { children: ReactNode }) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Load data from localStorage
  useEffect(() => {
    const savedNFTs = localStorage.getItem('nfts');
    const savedTransactions = localStorage.getItem('transactions');
    const savedWallet = localStorage.getItem('walletConnected');
    const savedAddress = localStorage.getItem('walletAddress');

    if (savedNFTs) {
      setNfts(JSON.parse(savedNFTs));
    } else {
      setNfts(sampleNFTs);
    }

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    if (savedWallet === 'true' && savedAddress) {
      setWalletConnected(true);
      setWalletAddress(savedAddress);
    }
  }, []);

  // Save NFTs to localStorage
  useEffect(() => {
  try {
    if (nfts.length > 0) {
      localStorage.setItem('nfts', JSON.stringify(nfts));
    }
  } catch (err) {
    console.error('localStorage quota exceeded, not saving nfts', err);
  }
}, [nfts]);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
        const address = accounts[0];
        setWalletAddress(address);
        setWalletConnected(true);
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAddress', address);
      } else {
        alert('Please install MetaMask to use this feature!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setWalletAddress('');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAddress');
  };

  const createNFT = (
  nftData: Omit<NFT, 'id' | 'owner' | 'salesCount' | 'createdAt' | 'tokenId'>,
  tokenId: string
) => {
  const newNFT: NFT = {
    ...nftData,
    id: Date.now().toString(),
    tokenId: tokenId,
    owner: walletAddress,
    salesCount: 0,
    createdAt: Date.now(),
    contractAddress: NFT_ADDRESS,
  };

  setNfts(prev => [...prev, newNFT]);
};

  const listNFTForSale = (nftId: string, price: number) => {
    setNfts(prev => prev.map(nft => 
      nft.id === nftId 
        ? { ...nft, isForSale: true, price, isForAuction: false }
        : nft
    ));
  };

  const listNFTForAuction = (nftId: string, startingBid: number, endTime: number) => {
    setNfts(prev => prev.map(nft => 
      nft.id === nftId 
        ? { 
            ...nft, 
            isForAuction: true, 
            isForSale: false,
            currentBid: startingBid,
            auctionEndTime: endTime,
            bids: [],
            highestBidder: undefined
          }
        : nft
    ));
  };

  const buyNFT = (nftId: string) => {
    const nft = nfts.find(n => n.id === nftId);
    if (!nft || !nft.price) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      nftId: nft.id,
      nftName: nft.name,
      buyer: walletAddress,
      seller: nft.owner,
      price: nft.price,
      timestamp: Date.now(),
    };

    setTransactions(prev => [...prev, transaction]);
    setNfts(prev => prev.map(n => 
      n.id === nftId 
        ? { 
            ...n, 
            owner: walletAddress, 
            isForSale: false, 
            price: undefined,
            salesCount: n.salesCount + 1 
          }
        : n
    ));
  };

  const placeBid = (nftId: string, amount: number) => {
    setNfts(prev => prev.map(nft => {
      if (nft.id === nftId && nft.isForAuction) {
        const newBid = { bidder: walletAddress, amount, time: Date.now() };
        return {
          ...nft,
          currentBid: amount,
          highestBidder: walletAddress,
          bids: [...(nft.bids || []), newBid],
        };
      }
      return nft;
    }));
  };

  const cancelListing = (nftId: string) => {
    setNfts(prev => prev.map(nft => 
      nft.id === nftId 
        ? { ...nft, isForSale: false, isForAuction: false, price: undefined }
        : nft
    ));
  };

  const updateNFTPrice = (nftId: string, newPrice: number) => {
    setNfts(prev => prev.map(nft => 
      nft.id === nftId 
        ? { ...nft, price: newPrice }
        : nft
    ));
  };

  const finalizeAuction = (nftId: string) => {
    const nft = nfts.find(n => n.id === nftId);
    if (!nft || !nft.highestBidder || !nft.currentBid) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      nftId: nft.id,
      nftName: nft.name,
      buyer: nft.highestBidder,
      seller: nft.owner,
      price: nft.currentBid,
      timestamp: Date.now(),
    };

    setTransactions(prev => [...prev, transaction]);
    
    // Remove completed auction
    setNfts(prev => prev.map(n => 
      n.id === nftId 
        ? { 
            ...n, 
            owner: nft.owner || "",
            isForAuction: false,
            currentBid: undefined,
            auctionEndTime: undefined,
            bids: undefined,
            highestBidder: undefined,
            salesCount: n.salesCount + 1,
            contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
          }
        : n
    ));
  };

  return (
    <NFTContext.Provider value={{
      nfts,
      transactions,
      walletConnected,
      walletAddress,
      connectWallet,
      disconnectWallet,
      createNFT,
      listNFTForSale,
      listNFTForAuction,
      buyNFT,
      placeBid,
      cancelListing,
      updateNFTPrice,
      finalizeAuction,
    }}>
      {children}
    </NFTContext.Provider>
  );
};

declare global {
  interface Window {
    ethereum?: any;
  }
}
