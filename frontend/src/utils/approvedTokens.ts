import addresses from "./addresses";
import AssetToken from "./artifacts/contracts/AssetToken.sol/AssetToken.json"; // Updated ABI import
import StableUSD from "./artifacts/contracts/StableUSD.sol/StableUSD.json"; // Updated ABI import

// Extract addresses from the addresses object
const { AssetLendingPlatformAddress, StableUSDAddress } = addresses.networks.linea_sepolia;

// Define the structure for token objects
interface Token {
  address: string;
  symbol: string;
  abi: any;
}

// List of approved ERC721 tokens (NFTs)
export const APPROVED_721_TOKENS: Token[] = [
  {
    address: AssetLendingPlatformAddress,
    symbol: "Asset NFT",
    abi: AssetToken.abi,
  },
];

// List of approved ERC20 tokens (stablecoins)
export const APPROVED_20_TOKENS: Token[] = [
  {
    address: StableUSDAddress,
    symbol: "sUSD",
    abi: StableUSD.abi,
  },
];