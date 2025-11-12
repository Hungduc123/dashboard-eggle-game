"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import NFTTable from "@/components/NFTTable";
import { fetchNFTList, fetchEggleEnergyBalance, NFT, NFTType } from "@/lib/api";

export default function Home() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const [activeTab, setActiveTab] = useState<NFTType>('pepe');
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [eggleEnergyBalance, setEggleEnergyBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Đảm bảo component đã mounted trước khi hiển thị wallet info
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch NFTs when wallet is connected or tab changes
  useEffect(() => {
    if (isConnected && address) {
      loadNFTs(address, activeTab);
    } else {
      setNfts([]);
      setError(null);
    }
  }, [isConnected, address, activeTab]);

  const loadNFTs = async (ownerAddress: string, nftType: NFTType = 'pepe') => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedNFTs, balance] = await Promise.all([
        fetchNFTList(ownerAddress, nftType),
        fetchEggleEnergyBalance(ownerAddress)
      ]);
      console.log(`💾 ${nftType.toUpperCase()} NFTs loaded:`, fetchedNFTs.length);
      console.log("💰 Eggle Energy balance:", balance);
      setNfts(fetchedNFTs);
      setEggleEnergyBalance(balance);
    } catch (err) {
      console.error("Failed to load NFTs:", err);
      setError("Failed to load NFTs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeed = async (nftId: string) => {
    console.log("🍖 Feeding NFT:", nftId);
    // TODO: Implement feed logic with smart contract
    alert(`Feeding NFT #${nftId} - Smart contract integration coming soon!`);
  };

  const handleFeedAll = async () => {
    const hungryNFTs = nfts.filter(nft => nft.health !== 1);
    if (hungryNFTs.length === 0) {
      alert("All NFTs are already Full! 🎉");
      return;
    }
    
    console.log("🍖 Feeding all hungry NFTs:", hungryNFTs.length);
    // TODO: Implement batch feed logic with smart contract
    alert(`Feeding ${hungryNFTs.length} NFTs - Smart contract integration coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🎮 My NFT Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View your Eggle NFT collection on Base
              </p>
            </div>
            <div className="flex items-center gap-4">
              {mounted && isConnected && address && (
                <>
                  <div className="hidden sm:block px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-gray-500">Connected</p>
                    <p className="text-sm font-mono text-gray-900">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                  </div>
                  <div className="hidden sm:block px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                    <p className="text-xs text-gray-500">Eggle Energy</p>
                    <p className="text-sm font-semibold text-purple-900">
                      ⚡ {eggleEnergyBalance} ENG
                    </p>
                  </div>
                </>
              )}
              <button
                onClick={() => open()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {mounted && isConnected ? "Manage Wallet" : "Connect Wallet"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isConnected ? (
          // Not Connected State
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
              <div className="text-6xl mb-6">🔗</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Connect Your Wallet
              </h2>
              <p className="text-gray-600 mb-6">
                Please connect your wallet to view your NFT collection on Base
                network.
              </p>
              <button
                onClick={() => open()}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        ) : loading ? (
          // Loading State
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Loading NFTs...
              </h2>
              <p className="text-gray-600">
                Fetching your collection from Base network
              </p>
            </div>
          </div>
        ) : error ? (
          // Error State
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
              <div className="text-6xl mb-6">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Error Loading NFTs
              </h2>
              <p className="text-red-600 mb-6">{error}</p>
              <button
                onClick={() => address && loadNFTs(address)}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : nfts.length === 0 ? (
          // No NFTs State
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="text-center bg-white rounded-2xl shadow-lg p-12 max-w-md">
              <div className="text-6xl mb-6">🎨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No NFTs Found
              </h2>
              <p className="text-gray-600 mb-2">
                You don't have any Eggle NFTs in your wallet yet.
              </p>
              <p className="text-sm text-gray-500">
                NFTs from contract: 0x7e48...4d4b
              </p>
            </div>
          </div>
        ) : (
          // NFT Table
          <div>
            {/* Tabs */}
            <div className="mb-6 flex items-center gap-4 border-b border-gray-200">
              <button
                onClick={() => setActiveTab('pepe')}
                className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                  activeTab === 'pepe'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🐸 PEPE NFTs
              </button>
              <button
                onClick={() => setActiveTab('eggle')}
                className={`px-6 py-3 font-semibold transition-all duration-200 border-b-2 ${
                  activeTab === 'eggle'
                    ? 'border-purple-600 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                🥚 EGGLE NFTs
              </button>
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your {activeTab === 'pepe' ? 'PEPE' : 'EGGLE'} Collection
                </h2>
                <p className="text-gray-600 mt-1">
                  Found {nfts.length} NFT{nfts.length !== 1 ? "s" : ""} in your
                  wallet • {nfts.filter(n => n.health !== 1).length} hungry
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleFeedAll}
                  disabled={nfts.filter(n => n.health !== 1).length === 0}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  🍖 Feed All ({nfts.filter(n => n.health !== 1).length})
                </button>
                <button
                  onClick={() => address && loadNFTs(address, activeTab)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-300 transition-colors duration-200"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            <NFTTable nfts={nfts} onFeed={handleFeed} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-600 text-sm">
        <p>Built with Next.js 15, AppKit & Base Network</p>
      </footer>
    </div>
  );
}
