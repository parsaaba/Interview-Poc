import { useState, useEffect } from "react";
import AssetToken from "../../artifacts/contracts/AssetToken.sol/AssetToken.json";
import StableUSD from "../../artifacts/contracts/StableUSD.sol/StableUSD.json";
import AssetLendingPlatform from "../../artifacts/contracts/AssetLendingPlatform.sol/AssetLendingPlatform.json";
import addresses from "../../utils/addresses";
import { ethers } from "ethers";
import * as dotenv from "dotenv";


dotenv.config();

export function useContracts() {
  const { assetTokenAddress, stableUSDAddress, assetLendingPlatformAddress } =
    addresses.networks.linea_sepolia;
  const [assetTokenContract, setAssetTokenContract] = useState<ethers.Contract | null>(null);
  const [stableUSDContract, setStableUSDContract] = useState<ethers.Contract | null>(null);
  const [assetLendingPlatformContract, setAssetLendingPlatformContract] = useState<ethers.Contract | null>(null);

  const [signer, setSigner] = useState<any>(null);

  useEffect(() => {
    const initializeContracts = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const API_KEY = process.env.INFURA_ENDPOINT;
          const PRIVATE_KEY = process.env.MNEMONIC_PHRASE;
          const infuraProvider = API_KEY
            ? new ethers.InfuraProvider("linea-sepolia", API_KEY)
            : null;
          const fallbackProvider = provider ?? infuraProvider;

          const signer = PRIVATE_KEY
            ? new ethers.Wallet(PRIVATE_KEY, infuraProvider)
            : await provider.getSigner();

          setSigner(signer);

          const assetToken = new ethers.Contract(
            assetTokenAddress,
            AssetToken.abi,
            fallbackProvider ? await fallbackProvider.getSigner() : signer
          );

          const stableUSD = new ethers.Contract(
            stableUSDAddress,
            StableUSD.abi,
            fallbackProvider ? await fallbackProvider.getSigner() : signer
          );

          const assetLendingPlatform = new ethers.Contract(
            assetLendingPlatformAddress,
            AssetLendingPlatform.abi,
            fallbackProvider ? await fallbackProvider.getSigner() : signer
          );

          setAssetTokenContract(assetToken);
          setStableUSDContract(stableUSD);
          setAssetLendingPlatformContract(assetLendingPlatform);

          console.log("Contracts initialized successfully!");
        } catch (error) {
          console.error("Error initializing contracts:", error);
        }
      } else {
        console.error("MetaMask is not installed!");
      }
    };

    initializeContracts();
  }, []);

  return { assetTokenContract, stableUSDContract, assetLendingPlatformContract, signer };
}