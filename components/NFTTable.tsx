"use client";

import { NFT, getHealthStatus, getHealthBadgeColor, getPickItem } from "@/lib/api";
import NFTImage from "./NFTImage";

interface NFTTableProps {
  nfts: NFT[];
  onFeed: (nftId: string) => void;
  selectedNFTs: Set<string>;
  onToggleSelect: (nftId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

export default function NFTTable({ nfts, onFeed, selectedNFTs, onToggleSelect, onSelectAll, onDeselectAll }: NFTTableProps) {
  const allSelected = nfts.length > 0 && nfts.every(nft => selectedNFTs.has(nft.nftId));
  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No NFTs found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
        <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <tr>
            <th className="px-4 py-3 text-center text-sm font-semibold">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={allSelected ? onDeselectAll : onSelectAll}
                className="w-4 h-4 cursor-pointer"
              />
            </th>
            <th className="px-4 py-3 text-center text-sm font-semibold">#</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Image</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Token ID</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">TBA Address</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Level</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Health</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Pick Item</th>
            <th className="px-4 py-3 text-left text-sm font-semibold">Items</th>
            <th className="px-4 py-3 text-center text-sm font-semibold">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {nfts.map((nft, index) => {
            const healthStatus = getHealthStatus(nft.health);
            const pickItem = getPickItem(nft);
            const isFull = nft.health === 1;

            return (
              <tr
                key={nft._id}
                className="hover:bg-gray-50 transition-colors"
              >
                {/* Checkbox */}
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedNFTs.has(nft.nftId)}
                    onChange={() => onToggleSelect(nft.nftId)}
                    className="w-4 h-4 cursor-pointer"
                  />
                </td>

                {/* Row Number */}
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-semibold text-gray-600">
                    {index + 1}
                  </span>
                </td>

                {/* Image */}
                <td className="px-4 py-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 relative">
                    <NFTImage
                      src={nft.image}
                      alt={nft.name}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">{nft.name}</div>
                </td>

                {/* Token ID */}
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 text-xs font-mono bg-blue-50 text-blue-700 rounded border border-blue-200">
                    #{nft.nftId}
                  </span>
                </td>

                {/* TBA Address */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-600">
                      {nft.tbaAddress.slice(0, 6)}...{nft.tbaAddress.slice(-4)}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(nft.tbaAddress)}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="Copy address"
                    >
                      📋
                    </button>
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  <span className="inline-block px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded border border-purple-300">
                    {nft.type}
                  </span>
                </td>

                {/* Level */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">📊</span>
                    <span className="text-sm font-semibold text-gray-700">{nft.level}</span>
                  </div>
                </td>

                {/* Health */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold rounded-full text-gray-700 ${getHealthBadgeColor(
                      nft.health
                    )}`}
                  >
                    {healthStatus}
                  </span>
                </td>

                {/* Pick Item */}
                <td className="px-4 py-3">
                  {pickItem !== "None" ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">🎁</span>
                      <span className="text-xs font-medium text-green-700">{pickItem}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>

                {/* Items Count */}
                <td className="px-4 py-3">
                  {nft.items && nft.items.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-sm">🎒</span>
                      <span className="text-xs font-semibold text-gray-700">
                        {nft.items.length} item{nft.items.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">-</span>
                  )}
                </td>

                {/* Action */}
                <td className="px-4 py-3 text-center">
                  {!isFull ? (
                    <button
                      onClick={() => onFeed(nft.nftId)}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                      🍖 Feed
                    </button>
                  ) : (
                    <span className="inline-block px-4 py-2 bg-gray-100 text-gray-400 text-sm font-semibold rounded-lg">
                      ✓ Full
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
