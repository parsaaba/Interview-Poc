import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { useContracts } from "./useContracts"; // Assuming useContracts hook manages contract instances
import { useSDK } from "@metamask/sdk-react";

const useERC20 = () => {
  const { account } = useSDK();
  const { erc20Contract } = useContracts(); // Assume erc20Contract is defined in useContracts hook
  const [balance, setBalance] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!erc20Contract || !account) return;

    const fetchBalance = async () => {
      try {
        const bal = await erc20Contract.balanceOf(account);
        setBalance(ethers.utils.formatUnits(bal, 18));
        const sym = await erc20Contract.symbol();
        setSymbol(sym);
      } catch (err) {
        setError(err as Error);
      }
    };

    fetchBalance();
  }, [erc20Contract, account]);

  const approve = useCallback(
    async (spender: string, amount: string) => {
      if (!erc20Contract || !account) {
        console.error("ERC20 contract or account not found.");
        return;
      }
      try {
        const parsedAmount = ethers.utils.parseUnits(amount, 18);
        const tx = await erc20Contract.approve(spender, parsedAmount);
        await tx.wait();
        console.log(`Approved ${amount} tokens for ${spender}`);
      } catch (err) {
        setError(err as Error);
      }
    },
    [erc20Contract, account]
  );

  return {
    balance,
    symbol,
    approve,
    error,
  };
};

export default useERC20;