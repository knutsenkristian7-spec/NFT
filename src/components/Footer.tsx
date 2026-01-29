import React from 'react';
import { motion } from 'motion/react';
import { Hexagon, Twitter, MessageCircle, Github, Mail } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: 'home' | 'market' | 'auction' | 'mynfts' | 'history') => void;
}

export const Footer = ({ setCurrentPage }: FooterProps) => {
  const socialLinks = [
    { icon: Twitter, label: 'Twitter', href: '#', color: 'hover:text-blue-400' },
    { icon: MessageCircle, label: 'Discord', href: '#', color: 'hover:text-indigo-400' },
    { icon: Github, label: 'GitHub', href: '#', color: 'hover:text-gray-300' },
    { icon: Mail, label: 'Email', href: '#', color: 'hover:text-purple-400' },
  ];

  const footerLinks = {
    'Company': [
      { name: 'About Us', onClick: () => {} },
      { name: 'Contact', onClick: () => {} },
      { name: 'Careers', onClick: () => {} },
    ],
    'Resources': [
      { name: 'Help Center', onClick: () => {} },
      { name: 'Privacy Policy', onClick: () => {} },
      { name: 'Terms of Service', onClick: () => {} },
    ],
    'Marketplace': [
      { name: 'Browse', onClick: () => setCurrentPage('market') },
      { name: 'Auctions', onClick: () => setCurrentPage('auction') },
      { name: 'History', onClick: () => setCurrentPage('history') },
    ],
  };

  return (
    <footer className="bg-gradient-to-b from-gray-900/50 to-black border-t border-purple-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <div className="relative">
                <Hexagon className="w-10 h-10 text-purple-500" fill="currentColor" />
                <div className="absolute inset-0 bg-purple-500 blur-lg opacity-50" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                NFT Marketplace
              </span>
            </motion.div>
            <p className="text-gray-400 mb-6 max-w-sm">
              The premier destination for digital creators and collectors. Explore, trade, and own unique digital assets on the blockchain.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 text-gray-400 ${social.color} transition-colors`}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-white font-bold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link, index) => (
                  <li key={index}>
                    <motion.button
                      onClick={link.onClick}
                      whileHover={{ x: 5 }}
                      className="text-gray-400 hover:text-purple-400 transition-colors text-left"
                    >
                      {link.name}
                    </motion.button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Connect with your community!
              </h3>
              <p className="text-gray-400">
                Subscribe to get the latest updates on drops and exclusive content
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-white transition-all"
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} NFT Marketplace. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button className="text-gray-500 hover:text-purple-400 transition-colors">
                Privacy Policy
              </button>
              <button className="text-gray-500 hover:text-purple-400 transition-colors">
                Terms of Service
              </button>
              <button className="text-gray-500 hover:text-purple-400 transition-colors">
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
