import { ethers } from "hardhat";

async function main() {
  const [owner, addr1] = await ethers.getSigners();
  console.log("Got signers");

  // Parameters for AssetToken constructor
  const maxSupply = 10000;
  const baseTokenURI = "https://example.com/metadata/";

  // Deploy AssetToken
  const AssetTokenFactory = await ethers.getContractFactory("AssetToken");
  const assetToken = await AssetTokenFactory.deploy(owner.address, maxSupply, baseTokenURI);
  await assetToken.deployed();
  console.log(`AssetToken deployed to: ${assetToken.address}`);

  // Mint NFT to addr1
  const mintTx = await assetToken.mint(addr1.address);
  await mintTx.wait(); // Ensure transaction is mined
  console.log("Minted 1 NFT to", addr1.address);

  const numberOfTokens = await assetToken.balanceOf(addr1.address);
  console.log("Number of tokens:", numberOfTokens.toString());

  // Additional deployments or interactions can go here...
}

// Execute the main function and catch any errors
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});