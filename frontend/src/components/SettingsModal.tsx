import {
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Spinner,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import useERC721 from "@/hooks/contracts/useERC721";
import { useSDK } from "@metamask/sdk-react";
import { TokenList } from "@/components/TokenList";
import { MintButtonList } from "@/components/MintButtonList";
import { APPROVED_721_TOKENS, APPROVED_20_TOKENS } from "@/utils/approvedTokens";
import useStableUSDContract from "@/hooks/contracts/useStableUSDContract";

const SettingsModal = () => {
  const { account } = useSDK();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mintToken, fetchBalance } = useERC721();
  const { mintStableUSD } = useStableUSDContract();
  const [loading, setLoading] = useState(false);

  const handleMintToken = async (tokenAddress: string, abi: any) => {
    setLoading(true);
    try {
      await mintToken(tokenAddress, abi);
      console.log("Token minted successfully.");
    } catch (error) {
      console.error("Error minting token:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Approved ERC721 Tokens:", APPROVED_721_TOKENS);
    console.log("Approved ERC20 Tokens:", APPROVED_20_TOKENS);
  }, []);

  return (
    <>
      <Button colorScheme="teal" onClick={onOpen}>
        <Text fontSize="16px">Settings</Text>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#27405d">
          <ModalHeader color="white">Settings</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody color="white">
            <Tabs variant="enclosed" isFitted>
              <TabList mb="1em">
                <Tab>Balances</Tab>
                <Tab>Actions</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box>
                    <Text fontSize="xl" mb={4} fontWeight="bold">
                      ERC20 Token Balances
                    </Text>
                    {APPROVED_20_TOKENS.length > 0 ? (
                      <TokenList tokens={APPROVED_20_TOKENS} />
                    ) : (
                      <Text>No ERC20 tokens available.</Text>
                    )}
                  </Box>
                  <Box mt={8}>
                    <Text fontSize="xl" mb={4} fontWeight="bold">
                      ERC721 Token Balances
                    </Text>
                    {APPROVED_721_TOKENS.length > 0 ? (
                      <TokenList tokens={APPROVED_721_TOKENS} />
                    ) : (
                      <Text>No ERC721 tokens available.</Text>
                    )}
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box mb={4}>
                    <Text fontSize="xl" fontWeight="bold">
                      Mint ERC721 Tokens
                    </Text>
                    <MintButtonList tokens={APPROVED_721_TOKENS} onMint={handleMintToken} />
                  </Box>
                  <Box mt={8}>
                    <Text fontSize="xl" fontWeight="bold">
                      Mint StableUSD
                    </Text>
                    <Button
                      colorScheme="teal"
                      onClick={() => handleMintToken(APPROVED_20_TOKENS[0].address, APPROVED_20_TOKENS[0].abi)}
                      isLoading={loading}
                    >
                      Mint StableUSD
                    </Button>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose} color="red">
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SettingsModal;