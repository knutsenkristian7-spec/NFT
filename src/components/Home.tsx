import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import { useNFT } from '../context/NFTContext';
import { PopularNFTs } from './PopularNFTs';
import { Community } from './Community';

export const Home = () => {
  const { walletConnected, connectWallet } = useNFT();

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-pink-900/30 to-blue-900/40" />
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-30"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1642104704074-907c0698cbd9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwZGlnaXRhbCUyMGFydCUyMGFic3RyYWN0fGVufDF8fHx8MTc2OTI3NDYxOHww&ixlib=rb-4.1.0&q=80&w=1080')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center md:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full mb-6 border border-purple-500/30"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-purple-300 text-sm">Welcome to the Future</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Explore, Collect,
                </span>
                <br />
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  and Trade NFTs
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-300 mb-8"
              >
                A Decentralized Platform for Creators and Collectors
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                onClick={connectWallet}
                disabled={walletConnected}
                className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-bold text-lg text-white overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                  initial={{ x: '100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center gap-2">
                  {walletConnected ? (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Wallet Connected
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </span>
                
                {/* Glowing effect */}
                {!walletConnected && (
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(212, 191, 70, 0.5)',
                        '0 0 40px rgba(65, 194, 75, 0.7)',
                        '0 0 20px rgba(46, 197, 202, 0.5)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-3 gap-6 mt-12"
              >
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-purple-400">10K+</div>
                  <div className="text-gray-400 text-sm">Artworks</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-pink-400">5K+</div>
                  <div className="text-gray-400 text-sm">Artists</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="text-3xl font-bold text-blue-400">15K+</div>
                  <div className="text-gray-400 text-sm">Collectors</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Floating NFT Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotateY: [0, 10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative"
              >
                {/* Main NFT Card */}
                <div className="relative bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-xl rounded-3xl p-4 border border-purple-500/30 shadow-2xl">
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1722778610349-e3c02e277ec2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMGRpZ2l0YWwlMjBhcnR8ZW58MXx8fHwxNzY5MjcxMjI1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                      alt="Featured NFT"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">Digital Masterpiece</h3>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">+24%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500" />
                        <span className="text-gray-300 text-sm">CryptoArtist</span>
                      </div>
                      <div className="text-right">
                        <div className="text-purple-400 font-bold">2.5 ETH</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating glow effects */}
                <div className="absolute inset-0 bg-purple-500 blur-3xl opacity-20 -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-pink-500 blur-3xl opacity-20 -z-10" />
              </motion.div>

              {/* Floating mini cards */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -left-8 top-1/4 w-24 h-24 bg-gradient-to-br from-blue-500/30 to-purple-500/30 backdrop-blur-xl rounded-2xl border border-blue-400/30 shadow-xl"
              />
              <motion.div
                animate={{
                  y: [0, 15, 0],
                  x: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -right-8 bottom-1/4 w-32 h-32 bg-gradient-to-br from-pink-500/30 to-orange-500/30 backdrop-blur-xl rounded-2xl border border-pink-400/30 shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Popular NFTs Section */}
      <PopularNFTs />

      {/* Community Section */}
      <Community />
    </div>
  );
};
