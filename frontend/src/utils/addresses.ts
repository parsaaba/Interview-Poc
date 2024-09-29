// Define the address structure for different networks
interface NetworkAddresses {
    AssetTokenAddress: string;
    StableUSDAddress: string;
    AssetLendingPlatformAddress: string;
  }
  
  // Define the structure for all networks
  interface Addresses {
    networks: {
      [networkName: string]: NetworkAddresses;
    };
  }
  
  // Define the address mappings for each network
  const addresses: Addresses = {
    networks: {
      linea_sepolia: {
        AssetTokenAddress: "0xE6383fbf38648353913a8dEA71f767Bc34a0cF2f",
        StableUSDAddress: "0x5207Cc2BBb9A49b88973a30339bD009d8472d294",
        AssetLendingPlatformAddress: "0xDc3C3c9a9db3e88C80bb75d3d8affcCBa48A8083",
      },
    },
  };
  
  export default addresses;