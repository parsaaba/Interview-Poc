import { useCallback, useState } from "react";
import { useContracts } from "./useContracts";
import { ethers } from "ethers";
import { useSDK } from "@metamask/sdk-react";
import addresses from "@/utils/addresses";

const useStableUSDContract = () => {
  const { sUSDContract } = useContracts();
  const { nftPlatformAddress } = addresses.networks.linea_sepolia;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const { account } = useSDK();

  const fetchTokenBalance = async (address: string | undefined): Promise<any> => {
    if (!sUSDContract) {
      console.error("Fetch balance: Contract not initialized.");
      return null;
    }
    try {
      return await sUSDContract.balanceOf(address);
    } catch (error) {
      console.error("Error fetching balance:", error);
      setError(error);
      return null;
    }
  };

  const approve = useCallback(
    async (askAmount: any) => {
      if (!sUSDContract || !account) {
        console.error("Approve: Contract not initialized or invalid parameters.");
        return;
      }

      const parsedAmount = ethers.parseUnits(askAmount.toString(), 6);

      try {
        const transaction = await sUSDContract.approve(
          nftPlatformAddress,
          parsedAmount,
          {
            from: account,
          }
        );
        await transaction.wait();
        console.log("Approved amount:", parsedAmount.toString());
      } catch (err) {
        console.error("Error approving token:", err);
      }
    },
    [sUSDContract, account, nftPlatformAddress]
  );

  const mintTokens = async (): Promise<void> => {
    if (!sUSDContract || !account) {
      console.error("Mint: Contract not initialized or invalid parameters.");
      return;
    }
    try {
      const amount = ethers.parseUnits("100000", 6); // 100,000 sUSD
      const tx = await sUSDContract.mint(account, amount);
      await tx.wait(); // Wait for the transaction to be mined
      console.log("Minted 100,000 sUSD to the msg.sender");
    } catch (error) {
      console.error("Error minting tokens:", error);
      setError(error);
    }
  };

  const fetchTokenSymbol = async (): Promise<string | null> => {
    if (!sUSDContract) {
      console.error("Fetch token symbol: Contract not initialized.");
      return null;
    }
    try {
      return await sUSDContract.symbol();
    } catch (error) {
      console.error("Error fetching token symbol:", error);
      setError(error);
      return null;
    }
  };

  return {
    fetchTokenBalance,
    mintTokens,
    fetchTokenSymbol,
    approve,
    isLoading,
    error,
  };
};

export default useStableUSDContract;