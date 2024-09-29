## ConsenSys Full-Stack Enablement PoC

This project is a Full-Stack Enablement Interview PoC for Consensys. It demonstrates the integration and use of multiple Consensys products and tools, including smart contract development, deployment, and front-end integration.


## Consensys Stack Used

1. MetaMask SDK

	•	MetaMask Connect Button: Enables users to connect their MetaMask wallet to the DApp.
	•	MetaMask Chrome Extension: Provides secure interaction with the blockchain.
	•	MetaMask Snaps (Nice to have): Extends the functionality of MetaMask beyond the basic wallet features.

2. Infura

	•	Create Testnet Endpoint: Set up a secure endpoint for interacting with Ethereum testnets.
	•	Connect to ERC721 & ERC1155 Contracts: Access and interact with the deployed NFT contracts.
	•	Connect to ERC20 Contracts (for borrowing): Utilize the deployed ERC20 tokens for lending and borrowing operations.

3. Linea Sepolia Testnet

	•	Network Configuration: Utilize the Linea Sepolia testnet for deploying and testing smart contracts.
	•	Deploy Contracts: Deploy custom ERC721, ERC1155, and ERC20 contracts on the Linea Sepolia testnet.
	•	Interaction and Testing: Perform testing and interaction with contracts using the Linea Sepolia network.


## Project Structure

	•	contracts/: Contains all smart contracts, including custom ERC721, ERC1155, and ERC20 implementations.
	•	scripts/: Deployment and interaction scripts for smart contracts using Hardhat.
	•	artifacts/: Generated artifact files after compiling smart contracts with Hardhat.
	•	src/:
	•	components/: React components used in the front-end.
	•	hooks/: Custom React hooks for interacting with smart contracts.
	•	pages/: Next.js pages representing different parts of the application (e.g., Borrowers, Lenders).
	•	styles/: CSS and styling for the application.


## Future Enhancements

	•	Implement MetaMask Snaps for enhanced security and features.
	•	Integrate additional functionality such as multi-chain support and advanced DeFi integrations.
