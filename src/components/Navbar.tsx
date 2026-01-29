import React from 'react';
import { motion } from 'motion/react';
import { Hexagon, Wallet, X } from 'lucide-react';
import { useNFT } from '../context/NFTContext';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: 'home' | 'market' | 'auction' | 'mynfts' | 'history') => void;
  onCreateClick: () => void;
}

export const Navbar = ({ currentPage, setCurrentPage, onCreateClick }: NavbarProps) => {
  const { walletConnected, walletAddress, connectWallet, disconnectWallet } = useNFT();

  const navItems = [
    { name: 'Home', id: 'home', enabled: true },
    { name: 'Market', id: 'market', enabled: true },
    { name: 'Auction', id: 'auction', enabled: walletConnected },
    { name: 'Create', id: 'create', enabled: walletConnected },
    { name: 'History', id: 'history', enabled: walletConnected },
    { name: 'MyNFTs', id: 'mynfts', enabled: walletConnected },
  ];

  const handleNavClick = (itemId: string) => {
    if (itemId === 'create') {
      onCreateClick();
    } else {
      setCurrentPage(itemId as any);
    }
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-purple-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => setCurrentPage('home')}
          >
            <div className="relative">
              <Hexagon className="w-8 h-8 text-purple-500" fill="currentColor" />
              <div className="absolute inset-0 bg-purple-500 blur-lg opacity-50" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              NFT Marketplace
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => item.enabled && handleNavClick(item.id)}
                disabled={!item.enabled}
                className={`px-4 py-2 rounded-lg font-medium transition-all relative ${
                  item.enabled
                    ? currentPage === item.id
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                    : 'text-gray-600 cursor-not-allowed'
                }`}
                whileHover={item.enabled ? { scale: 1.05 } : {}}
                whileTap={item.enabled ? { scale: 0.95 } : {}}
              >
                {currentPage === item.id && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Connect Wallet Button */}
          <motion.button
            onClick={walletConnected ? disconnectWallet : connectWallet}
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-all ${
              walletConnected
                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
            } text-white shadow-lg`}
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
            whileTap={{ scale: 0.95 }}
          >
            {walletConnected ? (
              <>
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
                <span className="sm:hidden">Disconnect</span>
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                <span>Connect</span>
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};