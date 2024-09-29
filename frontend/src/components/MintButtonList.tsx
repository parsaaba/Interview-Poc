import { Stack, Button, Box, Flex, Text } from "@chakra-ui/react";

const MintButton = ({ token, onMint }) => (
  <Button colorScheme="teal" onClick={() => onMint(token.address, token.abi)} width="full">
    Mint {token.symbol}
  </Button>
);

export const MintButtonList = ({ tokens, onMint }) => (
  <Stack spacing={4}>
    {tokens.map((token, index) => (
      <Box key={index} borderWidth="1px" borderRadius="lg" p={4} bg="#303261" color="white">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontWeight="bold">{token.name}</Text>
          <MintButton token={token} onMint={onMint} />
        </Flex>
      </Box>
    ))}
  </Stack>
);