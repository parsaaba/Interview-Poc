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
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { useState } from "react";
import useAssetTokenContract from "@/hooks/contracts/useAssetTokenContract";
import useLendingPlatformContract from "@/hooks/contracts/useLendingPlatformContract";
import addresses from "@/utils/addresses";

const CreateLoanModal: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { sUSDAddress, assetTokenAddress } = addresses.networks.mainnet;
  const [amount, setAmount] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [loading, setLoading] = useState(false);

  const { approve } = useAssetTokenContract();
  const { initiateLoan } = useLendingPlatformContract();

  const handleCreateLoan = async () => {
    if (!amount || !tokenId) {
      alert("Please enter all required fields.");
      return;
    }

    setLoading(true);
    try {
      await approve(assetTokenAddress, tokenId);
      await initiateLoan(
        sUSDAddress,
        ethers.utils.parseUnits(amount, 6),
        assetTokenAddress,
        tokenId,
        86400 // 1 day duration
      );
      alert("Loan created successfully!");
      onClose();
    } catch (err) {
      console.error("Error in handleCreateLoan:", err);
      alert("Failed to create loan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button colorScheme="teal" onClick={onOpen}>
        <Text p="4" fontSize="16px">Create Loan</Text>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent backgroundColor="#27405d">
          <ModalHeader color="white">Create Loan</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody color="white">
            <FormControl mb={4}>
              <FormLabel color="white">Amount (sUSD)</FormLabel>
              <Input
                placeholder="Enter amount in sUSD"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                color="white"
                focusBorderColor="pink.400"
                isRequired
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel color="white">Token ID to Stake</FormLabel>
              <Input
                placeholder="Enter Token ID"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                type="number"
                color="white"
                focusBorderColor="pink.400"
                isRequired
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleCreateLoan} isLoading={loading}>
              Stake NFT & Request Loan
            </Button>
            <Button variant="ghost" onClick={onClose} color="red" ml={3}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateLoanModal;