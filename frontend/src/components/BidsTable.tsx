import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  IconButton,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { Bid } from "@/hooks/contracts/usePlatformContract";
import ManageBidLenderModal from "./ManageBidLenderModal";
import { FaEye } from "react-icons/fa";

interface BidsTableProps {
  bids: Bid[];
}

const BidsTable: React.FC<BidsTableProps> = ({ bids }) => {
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleRowClick = (bid: Bid) => {
    setSelectedBid(bid);
    onOpen();
  };

  return (
    <Box w="full" p={4} borderWidth="1px" borderRadius="lg" overflowX="auto">
      <Table variant="striped" size="lg" colorScheme="teal">
        <Thead bg="teal.500">
          <Tr>
            <Th color="white">Token</Th>
            <Th color="white">Requester</Th>
            <Th color="white">Amount Requested</Th>
            <Th color="white">Collateral</Th>
            <Th color="white">Token ID</Th>
            <Th color="white">Status</Th>
            <Th color="white">Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {bids.map((bid, index) => (
            <Tr key={index} _hover={{ bg: "teal.100" }} cursor="pointer">
              <Td>{bid.tokenContract}</Td>
              <Td>{bid.from}</Td>
              <Td>{ethers.utils.formatUnits(bid.askAmount, 6)}</Td>
              <Td>{bid.nftContract}</Td>
              <Td>{bid.tokenId.toString()}</Td>
              <Td>{bid.accepted ? "Accepted" : "Pending"}</Td>
              <Td>
                <Tooltip label="Manage Bid" fontSize="md">
                  <IconButton
                    aria-label="Manage Bid"
                    icon={<FaEye />}
                    onClick={() => handleRowClick(bid)}
                  />
                </Tooltip>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {selectedBid && (
        <ManageBidLenderModal isOpen={isOpen} onClose={onClose} bid={selectedBid} />
      )}
    </Box>
  );
};

export default BidsTable;