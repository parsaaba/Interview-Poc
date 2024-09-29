import React from "react";
import { Flex, Box, Text, Button, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";
import SettingsModal from "./SettingsModal";

const NavBar = () => {
  const router = useRouter();

  return (
    <Flex bg="#303261" color="white" justifyContent="space-between" alignItems="center" p={4}>
      <Box onClick={() => router.push("/")} cursor="pointer">
        <img src="https://asset.brandfetch.io/idUXBRZHw0/idIDvhq9nr.jpeg" alt="Logo" style={{ width: "48px", borderRadius: "20px" }} />
      </Box>
      <Flex>
        <Tooltip label="Borrowers Page" fontSize="md">
          <Button colorScheme="teal" variant={router.pathname === "/borrowers" ? "solid" : "outline"} mr={2} onClick={() => router.push("/borrowers")}>
            Borrowers
          </Button>
        </Tooltip>
        <Tooltip label="Lenders Page" fontSize="md">
          <Button colorScheme="teal" variant={router.pathname === "/lenders" ? "solid" : "outline"} mr={2} onClick={() => router.push("/lenders")}>
            Lenders
          </Button>
        </Tooltip>
        <SettingsModal />
      </Flex>
    </Flex>
  );
};

export default NavBar;