import { useCallback, useEffect, useState } from "react";
import { useContracts } from "./useContracts";
import { ethers } from "ethers";
import { useSDK } from "@metamask/sdk-react";

export interface Loan {
  id: number;
  tokenContract: string;
  principal: string;
  from: string;
  nftContract: string;
  tokenId: number;
  isAccepted: boolean;
  lender: string;
  borrower: string;
  isRepaid: boolean;
  isDefaulted: boolean;
}

const usePlatformContract = () => {
  const { assetLendingPlatformContract } = useContracts();
  const { account } = useSDK();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoans = async () => {
    if (!assetLendingPlatformContract) {
      console.error("Contract not initialized.");
      return;
    }
    try {
      const nextId = await assetLendingPlatformContract.loanIdCounter();
      const allLoans = [];
      for (let i = 1; i <= nextId; i++) {
        const loan: any = await assetLendingPlatformContract.loans(i);
        allLoans.push(loan);
      }
      setLoans(allLoans);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching all loans:", error);
      setError(error);
    }
  };

  const initiateLoan = useCallback(
    async (tokenAddress: string, amount: any, nftContract: string, tokenId: any, duration: number) => {
      if (!assetLendingPlatformContract || !account) {
        console.error("Contract not initialized or invalid parameters.");
        return;
      }

      try {
        const parsedAmount = ethers.parseUnits(amount.toString(), 6);
        const transaction = await assetLendingPlatformContract.initiateLoan(
          tokenAddress,
          parsedAmount,
          nftContract,
          tokenId,
          duration,
          {
            from: account,
          }
        );
        await transaction.wait();
        console.log("Loan created successfully.");
      } catch (err) {
        console.error("Error initiating loan:", err);
      }
    },
    [assetLendingPlatformContract, account]
  );

  const acceptLoan = useCallback(
    async (loanId: number) => {
      if (!assetLendingPlatformContract || loanId == null) {
        console.error("Contract not initialized or invalid parameters.");
        return;
      }

      try {
        const transaction = await assetLendingPlatformContract.fundLoan(loanId, {
          from: account,
        });
        await transaction.wait();
        console.log("Loan accepted successfully.");
      } catch (err) {
        console.error("Error accepting loan:", err);
      }
    },
    [assetLendingPlatformContract, account]
  );

  const repayLoan = useCallback(
    async (loanId: number) => {
      if (!assetLendingPlatformContract || loanId == null) {
        console.error("Contract not initialized or invalid parameters.");
        return;
      }

      try {
        const transaction = await assetLendingPlatformContract.settleLoan(loanId, {
          from: account,
        });
        await transaction.wait();
        console.log("Loan repaid successfully.");
      } catch (err) {
        console.error("Error repaying loan:", err);
      }
    },
    [assetLendingPlatformContract, account]
  );

  const declareDefault = useCallback(
    async (loanId: number) => {
      if (!assetLendingPlatformContract || loanId == null) {
        console.error("Contract not initialized or invalid parameters.");
        return;
      }

      try {
        const transaction = await assetLendingPlatformContract.declareDefault(loanId, {
          from: account,
        });
        await transaction.wait();
        console.log("Loan defaulted successfully.");
      } catch (err) {
        console.error("Error declaring default:", err);
      }
    },
    [assetLendingPlatformContract, account]
  );

  useEffect(() => {
    if (assetLendingPlatformContract) {
      setIsLoading(true);
      fetchLoans().catch((error) => {
        console.error("Error fetching loans in useEffect:", error);
        setError(error);
        setIsLoading(false);
      });
    }
  }, [assetLendingPlatformContract]);

  return { fetchLoans, initiateLoan, loans, acceptLoan, repayLoan, declareDefault };
};

export default usePlatformContract;