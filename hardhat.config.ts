import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

// Ensure that you have these environment variables set in your .env file
const INFURA_ENDPOINT = process.env.INFURA_ENDPOINT || "";
const MNEMONIC_PHRASE = process.env.MNEMONIC_PHRASE || ""; // Default mnemonic for testing

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true, // Enable IR optimizer to reduce stack depth issues
    },
  },
  networks: {
    linea_sepolia: {
      url: `https://linea-sepolia.infura.io/v3/${INFURA_ENDPOINT}`,
      accounts: {
        mnemonic: MNEMONIC_PHRASE,
      },
    },
    // You can add other networks here as well, such as Hardhat local network
  },
  paths: {
    sources: "./contracts", // Source folder
    tests: "./test", // Test folder
    cache: "./cache", // Cache folder
    artifacts: "./artifacts", // Artifacts folder
  },
};

export default config;


