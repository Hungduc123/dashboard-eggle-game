"use client";

import { useEffect, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { useAppKit } from "@reown/appkit/react";
import { parseUnits, type Address } from "viem";
import NFTTable from "@/components/NFTTable";
import { fetchNFTList, fetchEggleEnergyBalance, fetchNFTDetail, NFT, NFTType } from "@/lib/api";

const EGGLE_ENERGY_TOKEN_ADDRESS = "0x8a0e751e5d7a2861ca7cf16d9720337e40604982" as Address;
const BULK_TRANSFER_ADDRESS = "0x0B2aB0Ed04Cc9367A88F1F22d0aD0E1f6e1Fd64D" as Address;

// ERC20 ABI for transfer function
const ERC20_TRANSFER_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
] as const;

// ERC721 ABI for transferFrom function
const ERC721_TRANSFER_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

export default function Home() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const { writeContractAsync } = useWriteContract();
  const [activeTab, setActiveTab] = useState<NFTType>('pepe');
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [eggleEnergyBalance, setEggleEnergyBalance] = useState<string>("0.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedNFTs, setSelectedNFTs] = useState<Set<string>>(new Set());
  const [feedAmount, setFeedAmount] = useState<number>(10);
  const [isFeedingInProgress, setIsFeedingInProgress] = useState(false);
  const [feedingStatus, setFeedingStatus] = useState<string>("");
  const [isTransferringInProgress, setIsTransferringInProgress] = useState(false);
  const [transferStatus, setTransferStatus] = useState<string>("");
  const [isPickingInProgress, setIsPickingInProgress] = useState(false);
  const [pickingStatus, setPickingStatus] = useState<string>("");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, activeTab]);

  const handleToggleSelect = (nftId: string) => {
    setSelectedNFTs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nftId)) {
        newSet.delete(nftId);
      } else {
        newSet.add(nftId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    setSelectedNFTs(new Set(nfts.map(nft => nft.nftId)));
  };

  const handleDeselectAll = () => {
    setSelectedNFTs(new Set());
  };

  const loadNFTs = async (ownerAddress: string, nftType: NFTType = 'pepe') => {
    setLoading(true);
    setError(null);
    setSelectedNFTs(new Set());
    try {
      const [fetchedNFTs, balance] = await Promise.all([
        fetchNFTList(ownerAddress, nftType),
        fetchEggleEnergyBalance(ownerAddress)
      ]);
      console.log(`💾 ${nftType.toUpperCase()} NFTs loaded:`, fetchedNFTs.length);
      console.log("💰 Eggle Energy balance:", balance);
      
      // Set NFTs immediately for faster UI response
      setNfts(fetchedNFTs);
      setEggleEnergyBalance(balance);
      
      // Fetch detailed info for each NFT in background (limit concurrent requests)
      const batchSize = 5; // Fetch 5 at a time to avoid overwhelming the API
      for (let i = 0; i < fetchedNFTs.length; i += batchSize) {
        const batch = fetchedNFTs.slice(i, i + batchSize);
        const detailPromises = batch.map(async (nft) => {
          const detail = await fetchNFTDetail(nft.nftAddress, nft.nftId, nftType);
          return { ...nft, ...detail };
        });
        
        const detailedBatch = await Promise.all(detailPromises);
        
        // Update NFTs incrementally
        setNfts(prev => {
          const updated = [...prev];
          detailedBatch.forEach(detailedNft => {
            const index = updated.findIndex(n => n.nftId === detailedNft.nftId);
            if (index !== -1) {
              updated[index] = detailedNft;
            }
          });
          return updated;
        });
      }
      
      console.log(`✅ Loaded details for ${fetchedNFTs.length} NFTs`);
    } catch (err) {
      console.error("Failed to load NFTs:", err);
      setError("Failed to load NFTs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };



  const handleBulkTransfer = async () => {
    if (selectedNFTs.size === 0) {
      setTransferStatus("⚠️ Please select NFTs to transfer!");
      setTimeout(() => setTransferStatus(""), 3000);
      return;
    }

    if (!address) {
      setTransferStatus("⚠️ Please connect your wallet first!");
      setTimeout(() => setTransferStatus(""), 3000);
      return;
    }

    const selectedNFTsData = nfts.filter(nft => selectedNFTs.has(nft.nftId));
    
    const confirmMessage = `Bạn có chắc muốn chuyển ${selectedNFTs.size} NFTs đến địa chỉ ${BULK_TRANSFER_ADDRESS}?\n\nNFTs:\n${selectedNFTsData.map(nft => `- ${nft.name} (#${nft.nftId})`).join('\n')}`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    console.log(`📤 Transferring ${selectedNFTs.size} NFTs to ${BULK_TRANSFER_ADDRESS}`);
    console.log("NFTs to transfer:", selectedNFTsData.map(n => ({ id: n.nftId, name: n.name })));

    setIsTransferringInProgress(true);
    setTransferStatus(`Starting to transfer ${selectedNFTs.size} NFTs...`);

    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < selectedNFTsData.length; i++) {
        const nft = selectedNFTsData[i];
            console.log("🚀 ~ handleBulkTransfer ~ nft.nftAddress:", nft.nftAddress)

        
        try {
          setTransferStatus(`Transferring NFT ${i + 1}/${selectedNFTsData.length}: ${nft.name} (#${nft.nftId})...`);
          
          console.log(`Transferring NFT #${nft.nftId} from ${address} to ${BULK_TRANSFER_ADDRESS}...`);
          
          const txHash = await writeContractAsync({
            address: nft.nftAddress as Address,
            abi: ERC721_TRANSFER_ABI,
            functionName: 'transferFrom',
            args: [address, BULK_TRANSFER_ADDRESS, BigInt(nft.nftId)],
          });

          console.log(`✅ Transfer transaction sent: ${txHash}`);
          setTransferStatus(`✅ Transaction sent for ${nft.name}. Waiting for next...`);
          
          // Wait for next transaction (optimized for Base network ~2s block time)
          await new Promise(resolve => setTimeout(resolve, 2500));
          
          successCount++;
          console.log(`✅ Successfully transferred NFT #${nft.nftId}`);
          
        } catch (error) {
          console.error(`❌ Failed to transfer NFT #${nft.nftId}:`, error);
          failCount++;
          setTransferStatus(`❌ Failed to transfer ${nft.name}. Continuing...`);
          await new Promise(resolve => setTimeout(resolve, 2500));
        }
      }

      // Final summary
      setTransferStatus(`✅ Transfer Complete! Success: ${successCount}, Failed: ${failCount}`);
      
      // Reload NFTs
      if (address) {
        await loadNFTs(address, activeTab);
      }
      
      // Clear selection
      setSelectedNFTs(new Set());

      setTimeout(() => setTransferStatus(""), 5000);

    } catch (error) {
      console.error("Error during transfer:", error);
      setTransferStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setTransferStatus(""), 5000);
    } finally {
      setIsTransferringInProgress(false);
    }
  };

  const handleBulkPickItem = async () => {
    if (selectedNFTs.size === 0) {
      setPickingStatus("⚠️ Please select NFTs to pick items!");
      setTimeout(() => setPickingStatus(""), 3000);
      return;
    }

    const selectedNFTsData = nfts.filter(nft => selectedNFTs.has(nft.nftId));
    const nftsWithPickItems = selectedNFTsData.filter(nft => nft.pickItem && parseFloat(nft.pickItem.value) > 0);
    
    if (nftsWithPickItems.length === 0) {
      setPickingStatus("⚠️ No NFTs with available pick items in selection!");
      setTimeout(() => setPickingStatus(""), 3000);
      return;
    }

    const confirmMessage = `Bạn có chắc muốn pick items cho ${nftsWithPickItems.length} NFTs?\n\nNFTs with items:\n${nftsWithPickItems.map(nft => `- ${nft.name} (#${nft.nftId})`).join('\n')}`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    console.log(`🎁 Picking items for ${nftsWithPickItems.length} NFTs`);
    console.log("NFTs to pick:", nftsWithPickItems.map(n => ({ id: n.nftId, name: n.name })));

    setIsPickingInProgress(true);
    setPickingStatus(`Starting to pick items for ${nftsWithPickItems.length} NFTs...`);

    let successCount = 0;
    let failCount = 0;

    try {
      for (let i = 0; i < nftsWithPickItems.length; i++) {
        const nft = nftsWithPickItems[i];
        
        try {
          setPickingStatus(`Picking item ${i + 1}/${nftsWithPickItems.length}: ${nft.name} (#${nft.nftId})...`);
          
          const payload = {
            chainId: 8453,
            address: nft.nftAddress.toLowerCase(),
            id: nft.nftId.toString()
          };
          
          console.log(`🎁 Picking item for NFT #${nft.nftId}:`, payload);
          
          const response = await fetch('https://pepe-api.eggle.xyz/nft/pick-item', {
            method: 'POST',
            headers: {
              'accept': '*/*',
              'content-type': 'application/json',
              'from-bacoor-with-love': 'true',
              'origin': 'https://eggle.xyz',
              'referer': 'https://eggle.xyz/',
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Successfully picked item for NFT #${nft.nftId}:`, result);
            setPickingStatus(`✅ Picked item for ${nft.name}. Waiting for next...`);
            successCount++;
          } else {
            const error = await response.text();
            console.error(`❌ Failed to pick item for NFT #${nft.nftId}:`, response.status, error);
            failCount++;
            setPickingStatus(`❌ Failed to pick item for ${nft.name}. Continuing...`);
          }
          
          // Wait before next request to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 1500));
          
        } catch (error) {
          console.error(`❌ Error picking item for NFT #${nft.nftId}:`, error);
          failCount++;
          setPickingStatus(`❌ Error with ${nft.name}. Continuing...`);
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }

      // Final summary
      setPickingStatus(`✅ Pick Items Complete! Success: ${successCount}, Failed: ${failCount}`);
      
      // Reload NFTs
      if (address) {
        await loadNFTs(address, activeTab);
      }
      
      // Clear selection
      setSelectedNFTs(new Set());

      setTimeout(() => setPickingStatus(""), 5000);

    } catch (error) {
      console.error("Error during pick items:", error);
      setPickingStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setPickingStatus(""), 5000);
    } finally {
      setIsPickingInProgress(false);
    }
  };

  const handleFeedSelected = async () => {
    if (selectedNFTs.size === 0) {
      setFeedingStatus("⚠️ Please select NFTs to feed!");
      setTimeout(() => setFeedingStatus(""), 3000);
      return;
    }

    if (!address) {
      setFeedingStatus("⚠️ Please connect your wallet first!");
      setTimeout(() => setFeedingStatus(""), 3000);
      return;
    }
    
    const selectedNFTsData = nfts.filter(nft => selectedNFTs.has(nft.nftId));
    const tbaAddresses = selectedNFTsData.map(nft => nft.tbaAddress);
    
    console.log(`🍖 Feeding ${selectedNFTs.size} NFTs with ${feedAmount} ENG each`);
    console.log("TBA Addresses:", tbaAddresses);
    console.log("Total amount:", selectedNFTs.size * feedAmount, "ENG");

    const totalAmount = selectedNFTs.size * feedAmount;
    const userBalance = parseFloat(eggleEnergyBalance);

    if (userBalance < totalAmount) {
      setFeedingStatus(`⚠️ Insufficient balance! Required: ${totalAmount} ENG, Your balance: ${userBalance} ENG`);
      setTimeout(() => setFeedingStatus(""), 5000);
      return;
    }

    setIsFeedingInProgress(true);
    setFeedingStatus(`Starting to feed ${selectedNFTs.size} NFTs...`);

    let successCount = 0;
    let failCount = 0;
    const amount = parseUnits(feedAmount.toString(), 18); // Convert to wei (18 decimals)

    try {
      for (let i = 0; i < tbaAddresses.length; i++) {
        const tbaAddress = tbaAddresses[i];
        const nft = selectedNFTsData[i];
        
        try {
          setFeedingStatus(`Feeding NFT ${i + 1}/${tbaAddresses.length}: ${nft.name} (#${nft.nftId})...`);
          
          console.log(`Sending ${feedAmount} ENG to ${tbaAddress}...`);
          
          const txHash = await writeContractAsync({
            address: EGGLE_ENERGY_TOKEN_ADDRESS,
            abi: ERC20_TRANSFER_ABI,
            functionName: 'transfer',
            args: [tbaAddress as Address, amount],
          });

          console.log(`✅ Transaction sent: ${txHash}`);
          setFeedingStatus(`✅ Transaction sent for ${nft.name}. Waiting for next...`);
          
          // Wait for next transaction (optimized for Base network ~2s block time)
          await new Promise(resolve => setTimeout(resolve, 2500));
          
          successCount++;
          console.log(`✅ Successfully fed NFT #${nft.nftId}`);
          
        } catch (error) {
          console.error(`❌ Failed to feed NFT #${nft.nftId}:`, error);
          failCount++;
          setFeedingStatus(`❌ Failed to feed ${nft.name}. Continuing...`);
          await new Promise(resolve => setTimeout(resolve, 2500));
        }
      }

      // Final summary
      setFeedingStatus(`✅ Feeding Complete! Success: ${successCount}, Failed: ${failCount}`);
      
      // Reload NFTs and balance
      if (address) {
        await loadNFTs(address, activeTab);
      }
      
      // Clear selection
      setSelectedNFTs(new Set());

      setTimeout(() => setFeedingStatus(""), 5000);

    } catch (error) {
      console.error("Error during feeding:", error);
      setFeedingStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setFeedingStatus(""), 5000);
    } finally {
      setIsFeedingInProgress(false);
    }
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
               {`You don't have any Eggle NFTs in your wallet yet.`}
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
                  wallet • {nfts.filter(n => n.health !== 1).length} hungry • {selectedNFTs.size} selected • 💩 Total Shit: {nfts.reduce((sum, nft) => sum + (nft.shits || 0), 0)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => address && loadNFTs(address, activeTab)}
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-300 transition-colors duration-200"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

          

            {/* Bulk Transfer Button */}
            <div className="mb-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg shadow-md p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-red-900 mb-1">🔴 Bán Hàng Loạt (Bulk Transfer)</h3>
                <p className="text-xs text-red-700">Chuyển các NFTs đã chọn đến: <span className="font-mono font-semibold">{BULK_TRANSFER_ADDRESS.slice(0, 10)}...{BULK_TRANSFER_ADDRESS.slice(-8)}</span></p>
              </div>
              <button
                onClick={handleBulkTransfer}
                disabled={selectedNFTs.size === 0 || isTransferringInProgress || isFeedingInProgress || isPickingInProgress}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isTransferringInProgress ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Transferring...
                  </span>
                ) : (
                  `📤 Transfer (${selectedNFTs.size})`
                )}
              </button>
            </div>

            {/* Transfer Status */}
            {transferStatus && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-600 border-t-transparent"></div>
                  <p className="text-sm font-medium text-red-900">{transferStatus}</p>
                </div>
              </div>
            )}


  {/* Bulk Pick Item Button */}
            <div className="mb-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg shadow-md p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-bold text-yellow-900 mb-1">🎁 Pick Items Hàng Loạt (Bulk Pick)</h3>
                <p className="text-xs text-yellow-700">Pick items từ các NFTs đã chọn (chỉ pick NFTs có items)</p>
              </div>
              <button
                onClick={handleBulkPickItem}
                disabled={selectedNFTs.size === 0 || isPickingInProgress || isTransferringInProgress || isFeedingInProgress}
                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isPickingInProgress ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Picking...
                  </span>
                ) : (
                  `🎁 Pick Items (${selectedNFTs.size})`
                )}
              </button>
            </div>

            {/* Pick Status */}
            {pickingStatus && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-yellow-600 border-t-transparent"></div>
                  <p className="text-sm font-medium text-yellow-900">{pickingStatus}</p>
                </div>
              </div>
            )}
            
            {/* Amount Selector and Feed Button */}
            <div className="mb-4 bg-white rounded-lg shadow-md p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">Amount per NFT:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFeedAmount(10)}
                    disabled={isFeedingInProgress || isTransferringInProgress || isPickingInProgress}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      feedAmount === 10
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    10 ENG
                  </button>
                  <button
                    onClick={() => setFeedAmount(20)}
                    disabled={isFeedingInProgress || isTransferringInProgress || isPickingInProgress}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      feedAmount === 20
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    20 ENG
                  </button>
                  <button
                    onClick={() => setFeedAmount(30)}
                    disabled={isFeedingInProgress || isTransferringInProgress || isPickingInProgress}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      feedAmount === 30
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    30 ENG
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-lg font-bold text-purple-900">
                    {selectedNFTs.size * feedAmount} ENG
                  </p>
                </div>
                <button
                  onClick={handleFeedSelected}
                  disabled={selectedNFTs.size === 0 || isFeedingInProgress || isTransferringInProgress || isPickingInProgress}
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isFeedingInProgress ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Feeding...
                    </span>
                  ) : (
                    `🍖 Feed Selected (${selectedNFTs.size})`
                  )}
                </button>
              </div>
            </div>

            {/* Feeding Status */}
            {feedingStatus && (
              <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                  <p className="text-sm font-medium text-blue-900">{feedingStatus}</p>
                </div>
              </div>
            )}

            <NFTTable 
              nfts={nfts} 
              selectedNFTs={selectedNFTs}
              onToggleSelect={handleToggleSelect}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
              onPickSuccess={() => address && loadNFTs(address, activeTab)}
            />
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
