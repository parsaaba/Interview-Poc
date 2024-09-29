import { Flex, Heading, Box, Text } from "@chakra-ui/react";
import styles from "@/styles/Home.module.css";
import { useSDK } from "@metamask/sdk-react";
import CreateBidModal from "@/components/CreateLoanModal";
import BidsTable from "@/components/BidsTable";
import { useEffect } from "react";
import usePlatformContract from "@/hooks/contracts/usePlatformContract";

const Borrowers: React.FC = () => {
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
        Your Bids
      </Heading>
      {connected ? (
        <>
          <BidsTable bids={bids} />
          <Box mt={6}>
            <CreateBidModal />
          </Box>
        </>
      ) : (
        <Text fontSize="xl" mt={4}>
          Please connect your MetaMask wallet to view and create bids.
        </Text>
      )}
    </Flex>
  );
};

export default Borrowers;