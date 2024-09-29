import { Flex, Heading, Box, Text } from "@chakra-ui/react";
import { useSDK } from "@metamask/sdk-react";
import { useEffect } from "react";
import usePlatformContract from "@/hooks/contracts/usePlatformContract";
import BidsTable from "@/components/BidsTable";

const Lenders: React.FC = () => {
  const { connected } = useSDK();
  const { bids } = usePlatformContract();

  useEffect(() => {}, [bids]);

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      direction="column"
      p={8}
      bg="#2D3748"
      color="white"
    >
      <Heading as="h1" size="xl" mb={4}>
        All Bids
      </Heading>
      {connected ? (
        <BidsTable bids={bids} />
      ) : (
        <Box mt={6}>
          <Text fontSize="xl">Please connect your MetaMask wallet to view bids.</Text>
        </Box>
      )}
    </Flex>
  );
};

export default Lenders;