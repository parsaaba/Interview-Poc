import { useCallback, useEffect, useState } from "react";
import { useContracts } from "./useContracts";
import addresses from "@/utils/addresses";
import { useSDK } from "@metamask/sdk-react";

const useCollateralTokenContract = () => {
  const { assetTokenContract } = useContracts(); // Updated contract name
  const { nftPlatformAddress } = addresses.networks.linea_sepolia;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const { account } = useSDK();

  const getCurrentTokenId = async () => {
    if (!assetTokenContract) {
      console.error("Get current tokenId: Contract not initialized!");
      return;
    }
    try {
      return await assetTokenContract.tokenCounter();
    } catch (err) {
      console.error("Error retrieving current tokenId: ", err);
    }
  };

  const approve = useCallback(async (tokenId: any) => {
    if (!assetTokenContract || !account) {
      console.error("Approve: Contract not initialized or invalid parameters.");
      return;
    }

    try {
      const transaction = await assetTokenContract.approve(
        nftPlatformAddress,
        tokenId,
        {
          from: account,
        }
      );
      await transaction.wait();
      console.log("Approved token ", tokenId.toString(), " from account ", account);
    } catch (err) {
      console.error("Error approving token:", err);
    }
  }, [assetTokenContract, account, nftPlatformAddress]);

  const mint = useCallback(async () => {
    if (!assetTokenContract || !account) {
      console.error("Mint: Contract not initialized or invalid parameters.");
      return;
    }

    try {
      const transaction = await assetTokenContract.createToken(account);
      await transaction.wait();
      console.log("Minted NFT successfully.");
    } catch (err) {
      console.error("Error minting token:", err);
    }
  }, [assetTokenContract, account]);

  useEffect(() => {
    if (assetTokenContract) {
      setIsLoading(false);
    }
  }, [assetTokenContract]);

  return { approve, getCurrentTokenId, mint, isLoading, error };
};

export default useCollateralTokenContract;