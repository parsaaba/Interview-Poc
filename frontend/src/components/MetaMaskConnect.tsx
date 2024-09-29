import { Button, Spinner, Text, useToast, Box } from "@chakra-ui/react";
import { useSDK } from "@metamask/sdk-react";
import { useState } from "react";

const MetaMaskConnect: React.FC = () => {
  const { connected, sdk } = useSDK();
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleConnect = async () => {
    if (!sdk) return;
    setLoading(true);
    try {
      await sdk.connect();
      toast({
        title: "Connected",
        description: "Successfully connected to MetaMask",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to MetaMask. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box textAlign="center" mt={8}>
      <Button
        colorScheme="teal"
        onClick={handleConnect}
        disabled={connected || loading}
        size="lg"
      >
        {loading ? (
          <Spinner size="sm" />
        ) : connected ? (
          "Connected"
        ) : (
          "Connect to MetaMask"
        )}
      </Button>
      {connected && (
        <Text mt={2} color="green.500" fontSize="lg">
          Connected to MetaMask
        </Text>
      )}
    </Box>
  );
};

export default MetaMaskConnect;