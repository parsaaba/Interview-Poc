// src/ethereum.d.ts

// Import the existing types from ethers
import { ExternalProvider } from "@ethersproject/providers";

// Extend the global Window interface to include the Ethereum provider
declare global {
  interface Window {
    ethereum?: ExternalProvider & {
      isMetaMask?: boolean; // Add an optional property to check if MetaMask is being used
      on?: (eventName: string, callback: (...args: any[]) => void) => void; // For listening to events
      removeListener?: (eventName: string, callback: (...args: any[]) => void) => void; // For removing event listeners
    };
  }
}