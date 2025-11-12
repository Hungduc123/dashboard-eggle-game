"use client";

import { getHealthBadgeColor, getHealthStatus, getPickItem, NFT } from "@/lib/api";
import NFTImage from "./NFTImage";

interface NFTCardProps {
  nft: NFT;
}

export default function NFTCard({ nft }: NFTCardProps) {
  const health = nft.health;
  const healthStatus = getHealthStatus(health);
  const pickItem = getPickItem(nft);

  const imageUrl = nft.image || "/placeholder-nft.png";
  const nftName = nft.name || `#${nft.nftId}`;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200 group">
      {/* NFT Image */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        <NFTImage
          src={imageUrl}
          alt={nftName}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* NFT Info */}
      <div className="p-4">
        {/* Name/Token ID */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={nftName}>
          {nftName}
        </h3>

        {/* Token ID Badge */}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-mono bg-blue-50 text-blue-700 rounded border border-blue-200">
            Token #{nft.nftId}
          </span>
        </div>

        {/* Attributes */}
        <div className="space-y-2">
          {/* Health Attribute */}
          <div className="flex items-center gap-2">
            <span className="text-lg">🧠</span>
            <span className="text-sm text-gray-600 font-medium">Health:</span>
            <span
              className={`px-2 py-1 text-xs font-semibold rounded border text-gray-60 ${getHealthBadgeColor(
                health
              )}`}
            >
              {healthStatus}
            </span>
          </div>

          {/* Type */}
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <span className="text-sm text-gray-600 font-medium">Type:</span>
            <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-800 rounded border border-purple-300">
              {nft.type}
            </span>
          </div>

          {/* Level */}
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="text-sm text-gray-600 font-medium">Level:</span>
            <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded border border-indigo-300">
              {nft.level}
            </span>
          </div>

          {/* Pick Item Attribute */}
          {pickItem !== "None" && (
            <div className="flex items-center gap-2">
              <span className="text-lg">🎒</span>
              <span className="text-sm text-gray-600 font-medium">Pick Item:</span>
              <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded border border-yellow-300">
                {pickItem}
              </span>
            </div>
          )}

          {/* Additional attributes if any */}
          {nft.attributes && nft.attributes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-1.5">
                {nft.attributes.slice(0, 3).map((attr: { trait_type: string; value: string | number }, index: number) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-gray-50 text-gray-700 rounded border border-gray-200"
                    title={`${attr.trait_type}: ${attr.value}`}
                  >
                    {attr.trait_type}: {attr.value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
