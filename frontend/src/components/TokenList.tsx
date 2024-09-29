import { useContracts } from "@/hooks/contracts/useContracts";
import useERC721 from "@/hooks/contracts/useERC721";
import useERC20 from "@/hooks/contracts/useERC20"; // Corrected import
import { Box, Flex, Text, Stack } from "@chakra-ui/react";
import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";

const TokenInfo = ({ token }: any) => {
  const { account } = useSDK();
  const { approvedTokens } = useERC721();
  const { balance, symbol } = useERC20(); // Use the balance and symbol from useERC20
  const { signer } = useContracts();
  const [erc721Balance, setErc721Balance] = useState<string | null>(null);
  const [erc20Balance, setErc20Balance] = useState<string | null>(balance);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!signer || !account) return;

    const fetchBalances = async () => {
      try {
        const contract = new ethers.Contract(token.address, token.abi, signer);
        const balance = await contract.balanceOf(account);
        setErc721Balance(balance.toString());
      } catch (err) {
        setError("Error fetching balance");
      }
    };

    fetchBalances();
  }, [signer, account]);

  return (
    <Box p={4} borderWidth={1} borderRadius="lg" overflow="hidden" mb={4}>
      <Flex justifyContent="space-between">
        <Text>Token: {symbol ? symbol : token.symbol}</Text>
      </Flex>
      <Text mt={2}>ERC721 Balance: {erc721Balance}</Text>
      <Text mt={2}>ERC20 Balance: {erc20Balance}</Text>
      {error && <Text color="red">{error}</Text>}
    </Box>
  );
};

export const TokenList = ({ tokens }: any) => {
  return (
    <Stack spacing={4}>
      {tokens.map((token: any, index: number) => (
        <TokenInfo key={index} token={token} />
      ))}
    </Stack>
  );
};