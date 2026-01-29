import React, { useState } from 'react';
import { NFTProvider } from './context/NFTContext';
import { Navbar } from './components/Navbar';
import { Home } from './components/Home';
import { Market } from './components/Market';
import { Auction } from './components/Auction';
import { MyNFTs } from './components/MyNFTs';
import { History } from './components/History';
import { CreateModal } from './components/CreateModal';
import { Footer } from './components/Footer';

type Page = 'home' | 'market' | 'auction' | 'mynfts' | 'history';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <NFTProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
        <Navbar 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          onCreateClick={() => setShowCreateModal(true)}
        />
        
        <main className="min-h-screen">
          {currentPage === 'home' && <Home />}
          {currentPage === 'market' && <Market />}
          {currentPage === 'auction' && <Auction />}
          {currentPage === 'mynfts' && <MyNFTs />}
          {currentPage === 'history' && <History />}
        </main>

        <Footer setCurrentPage={setCurrentPage} />

        {showCreateModal && (
          <CreateModal onClose={() => setShowCreateModal(false)} />
        )}
      </div>
    </NFTProvider>
  );
}
