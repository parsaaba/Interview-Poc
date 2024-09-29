import React from "react";
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
  Box,
  useDisclosure,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import useLendingPlatformContract, { Loan } from "@/hooks/contracts/useLendingPlatformContract";
import useStableUSDContract from "@/hooks/contracts/useStableUSDContract";

interface ManageLoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  bid: Loan;
}

const ManageLoanModal: React.FC<ManageLoanModalProps> = ({ isOpen, onClose, bid }) => {
  const { acceptLoan, repayLoan, declareDefault } = useLendingPlatformContract();
  const { approve } = useStableUSDContract();

  const handleManageLoan = async () => {
    const action = bid.isAccepted ? "Repay" : "Lend";
    try {
      if (action === "Repay") {
        await approve(bid.collateralToken, ethers.constants.MaxUint256);
        await repayLoan(bid.id);
      } else if (action === "Lend") {
        await approve(bid.collateralToken, bid.principal);
        await acceptLoan(bid.id);
      }
    } catch (err) {
      console.error("Error managing loan:", err);
      alert("Failed to manage loan. Please try again.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent backgroundColor="#27405d">
        <ModalHeader color="white">Manage Loan</ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody color="white">
          <FormControl mb={4}>
            <FormLabel color="white">Token Contract</FormLabel>
            <Text fontSize="md" color="gray.400">{bid.collateralToken}</Text>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel color="white">Loan Amount</FormLabel>
            <Text fontSize="md" color="gray.400">{ethers.utils.formatUnits(bid.principal, 6)}</Text>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel color="white">NFT Contract</FormLabel>
            <Text fontSize="md" color="gray.400">{bid.nftContract}</Text>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel color="white">Token ID</FormLabel>
            <Text fontSize="md" color="gray.400">{bid.tokenId.toString()}</Text>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" onClick={handleManageLoan}>
            {bid.isAccepted ? "Repay" : "Lend"}
          </Button>
          <Button variant="ghost" onClick={onClose} color="red" ml={3}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ManageLoanModal;