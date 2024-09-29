import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { APPROVED_TOKENS } from "@/utils/approvedTokens";
import * as dotenv from "dotenv";
import { useSDK } from "@metamask/sdk-react";
import { useContracts } from "./useContracts";

dotenv.config();

const useERC721 = () => {
  const { account } = useSDK();
  const { signer } = useContracts();
  const [approvedTokens] = useState(APPROVED_TOKENS);
  const [error, setError] = useState<any>(null);

  const mintToken = useCallback(
    async (contractAddress: string, abi: any) => {
      if (!signer) {
        setError("Signer not initialized");
        return;
      }

      try {
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const tx = await contract.mint(account);
        await tx.wait();
        console.log("Minted ERC721 token successfully.");
      } catch (err) {
        console.error("Error minting tokens:", err);
        setError(err);
      }
    },
    [signer, account]
  );

  const fetchBalance = useCallback(
    async (contractAddress: string, abi: any) => {
      if (!signer) {
        console.error("Signer not initialized");
        return null;
      }

      try {
        const contract = new ethers.Contract(contractAddress, abi, signer);
        const balance = await contract.balanceOf(account);
        return balance.toString();
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError(err);
        return null;
      }
    },
    [signer, account]
  );

  return {
    approvedTokens,
    mintToken,
    fetchBalance,
    error,
  };
};

export default useERC721;