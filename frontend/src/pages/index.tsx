import { Button, Flex, Grid, Heading, Text, Box } from "@chakra-ui/react";
import MetaMaskConnect from "@/components/MetaMaskConnect";
import { useSDK } from "@metamask/sdk-react";
import { useRouter } from "next/router";

const Home: React.FC = () => {
  const { connected } = useSDK();
  const router = useRouter();

  return (
    <Flex
      height="100vh"
      alignItems="center"
      justifyContent="center"
      direction="column"
      bg="#1A202C"
      color="white"
      p={6}
    >
      <Box mb={6}>
        <img
          src="https://asset.brandfetch.io/idUXBRZHw0/idIDvhq9nr.jpeg"
          alt="Logo"
          style={{ width: "200px", borderRadius: "20px" }}
        />
      </Box>
      <Heading as="h1" size="2xl" mb={4} textAlign="center">
        NFT Collateralized Lending Platform
      </Heading>
      <Text fontSize="lg" mb={6} textAlign="center" px={4}>
        Borrow and lend using NFTs as collateral on our secure and efficient platform.
      </Text>
      {!connected && <MetaMaskConnect />}
      {connected && (
        <Grid templateColumns="repeat(1, 1fr)" gap={6} mt={10}>
          <Button
            colorScheme="pink"
            size="lg"
            onClick={() => {
              router.push("/borrowers");
            }}
            style={{ width: "300px" }}
          >
            <Text>Go to Borrowers</Text>
          </Button>
          <Button
            variant="outline"
            colorScheme="pink"
            size="lg"
            onClick={() => {
              router.push("/lenders");
            }}
            style={{ width: "300px" }}
          >
            <Text>Go to Lenders</Text>
          </Button>
        </Grid>
      )}
    </Flex>
  );
};

export default Home;