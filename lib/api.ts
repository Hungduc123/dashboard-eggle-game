// TypeScript interfaces for NFT data
export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export interface NFT {
  _id: string;
  owner: string;
  nftId: string;
  nftAddress: string;
  chainId: number;
  name: string;
  ownerUpdate: string;
  bornAt: number;
  hatchedAt: number;
  lastFeedAt: number;
  death: boolean;
  type: string;
  level: number;
  health: number;
  cooked: boolean;
  staked: boolean;
  lastSyncMetadatadAt: number;
  tbaAddress: string;
  attributes: NFTAttribute[];
  image: string;
  isHatched: boolean;
  pickItem?: {
    _id: string;
    value: string;
    type: string;
    image?: string;
    picked: boolean;
    claimed: boolean;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items?: any[];
}

export interface NFTListResponse {
  items: NFT[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const API_BASE_URL = "https://pepe-api.eggle.xyz";
const EGGLE_API_BASE_URL = "https://api.eggle.xyz";
const PEPE_NFT_CONTRACT_ADDRESS = "0x7e48eeb40d6083d7da004f662cd9a63e0a784d4b";
const EGGLE_NFT_CONTRACT_ADDRESS = "0x4e45cd58260f59babb528f2653b61e4623b3df99";
const EGGLE_ENERGY_TOKEN_ADDRESS = "0x8a0e751e5d7a2861ca7cf16d9720337e40604982";

export type NFTType = 'pepe' | 'eggle';


// ERC20 ABI for balanceOf function
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const;

/**
 * Fetch Eggle Energy (ENG) token balance by calling smart contract
 */
export async function fetchEggleEnergyBalance(ownerAddress: string): Promise<string> {
  try {
    const { createPublicClient, http } = await import('viem');
    const { base } = await import('viem/chains');

    const client = createPublicClient({
      chain: base,
      transport: http(),
    });

    const balance = await client.readContract({
      address: EGGLE_ENERGY_TOKEN_ADDRESS as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'balanceOf',
      args: [ownerAddress as `0x${string}`],
    });

    // Convert from wei to ether (divide by 10^18)
    const balanceInEther = Number(balance) / 1e18;
    return balanceInEther.toFixed(2);
  } catch (error) {
    console.error("Error fetching Eggle Energy balance:", error);
    return "0.00";
  }
}

/**
 * Fetch NFT list for a given owner address
 */
export async function fetchNFTList(ownerAddress: string, nftType: NFTType = 'pepe', limit: number = 10000): Promise<NFT[]> {
  const apiBaseUrl = nftType === 'pepe' ? API_BASE_URL : EGGLE_API_BASE_URL;
  const contractAddress = nftType === 'pepe' ? PEPE_NFT_CONTRACT_ADDRESS : EGGLE_NFT_CONTRACT_ADDRESS;
  
  const url = `${apiBaseUrl}/nft?owner=${ownerAddress}&limit=${limit}&nftAddresses=${contractAddress}`;
  console.log(`🔍 Fetching ${nftType.toUpperCase()} NFTs from:`, url);
  
  const response = await fetch(url);
  if (!response.ok) {
    console.error("❌ API Error:", response.status, response.statusText);
    throw new Error('Failed to fetch NFT list');
  }
  
  const data = await response.json();
  console.log("📦 API Response:", data);
  console.log("📊 Response structure:", {
    isArray: Array.isArray(data),
    hasItems: !!data.items,
    itemsCount: data.items?.length || 0,
    total: data.total
  });
  
  // Handle possible response formats
  if (Array.isArray(data)) {
    console.log(`✅ Found ${data.length} ${nftType.toUpperCase()} NFTs (direct array)`);
    return data;
  }
  
  if (data.items && Array.isArray(data.items)) {
    console.log(`✅ Found ${data.items.length} ${nftType.toUpperCase()} NFTs (in .items, total: ${data.total})`);
    return data.items;
  }
  
  if (data.nfts && Array.isArray(data.nfts)) {
    console.log(`✅ Found ${data.nfts.length} ${nftType.toUpperCase()} NFTs (nested in .nfts)`);
    return data.nfts;
  }
  
  console.warn(`⚠️ No ${nftType.toUpperCase()} NFTs found in response`);
  return [];
}

/**
 * Helper function to get health status text
 */
export function getHealthStatus(health: number): string {
  switch (health) {
    case 1:
      return 'Full';
    case 2:
      return 'Hungry';
    case 3:
      return 'Weak';
    case 4:
      return 'Dangerous';
    case 5:
      return 'Dead';
    default:
      return 'Unknown';
  }
}

/**
 * Helper function to get health badge color class
 */
export function getHealthBadgeColor(health: number): string {
  switch (health) {
    case 1:
      return 'bg-green-500'; // Full - Green
    case 2:
      return 'bg-yellow-500'; // Hungry - Yellow
    case 3:
      return 'bg-orange-500'; // Weak - Orange
    case 4:
      return 'bg-red-500'; // Dangerous - Red
    case 5:
      return 'bg-gray-800'; // Dead - Dark Gray
    default:
      return 'bg-gray-400';
  }
}

/**
 * Helper function to get pick item from NFT
 * Only show if pickItem exists and value > 0
 */
export function getPickItem(nft: NFT): string {
  if (!nft.pickItem) return "None";
  
  const value = parseFloat(nft.pickItem.value);
  if (value <= 0) return "None";
  
  // Convert from wei to ether (divide by 10^18)
  const tokenAmount = value / 1e18;
  return `${tokenAmount.toFixed(2)} ${nft.pickItem.type || 'tokens'}`;
}

/**
 * Helper function to get specific attribute value
 */
export function getAttributeValue(
  attributes: NFTAttribute[] | undefined,
  traitType: string
): string | number | undefined {
  if (!attributes) return undefined;
  const attr = attributes.find(
    (a) => a.trait_type.toLowerCase() === traitType.toLowerCase()
  );
  return attr?.value;
}
