import { expect } from "chai";
import { ethers } from "hardhat";
import { AssetLendingPlatform, AssetToken, StableUSD } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("AssetLendingPlatform", function () {
  let assetLendingPlatform: AssetLendingPlatform;
  let assetToken: AssetToken;
  let stableUSD: StableUSD;
  let owner: SignerWithAddress, borrower: SignerWithAddress, lender: SignerWithAddress;

  // Correct import and usage of parseUnits from ethers.utils
  const initialSupply = ethers.utils.parseUnits("1000000", 6); // Ensure proper usage of parseUnits

  before(async function () {
    [owner, borrower, lender] = await ethers.getSigners();

    // Deploy AssetToken contract
    const AssetTokenFactory = await ethers.getContractFactory("AssetToken");
    assetToken = (await AssetTokenFactory.deploy(owner.address)) as AssetToken;
    await assetToken.deployed();
    console.log(`AssetToken deployed to: ${assetToken.address}`);

    // Deploy StableUSD contract
    const StableUSDFactory = await ethers.getContractFactory("StableUSD");
    stableUSD = (await StableUSDFactory.deploy(initialSupply)) as StableUSD;
    await stableUSD.deployed();
    console.log(`StableUSD deployed to: ${stableUSD.address}`);

    // Deploy AssetLendingPlatform contract
    const AssetLendingPlatformFactory = await ethers.getContractFactory("AssetLendingPlatform");
    assetLendingPlatform = (await AssetLendingPlatformFactory.deploy(stableUSD.address)) as AssetLendingPlatform;
    await assetLendingPlatform.deployed();
    console.log(`AssetLendingPlatform deployed to: ${assetLendingPlatform.address}`);
  });

  describe("AssetToken contract functionality", function () {
    it("should mint an NFT to the borrower", async function () {
      await expect(assetToken.connect(borrower).mint(borrower.address))
        .to.emit(assetToken, "Transfer")
        .withArgs(ethers.constants.AddressZero, borrower.address, 1);
      
      expect(await assetToken.ownerOf(1)).to.equal(borrower.address);
    });
  });

  describe("AssetLendingPlatform loan functionality", function () {
    it("should allow a borrower to request a loan", async function () {
      await assetToken.connect(borrower).approve(assetLendingPlatform.address, 1);
      
      const loanAmount = ethers.utils.parseUnits("1000", 6); // Ensure correct usage of parseUnits
      await expect(
        assetLendingPlatform.connect(borrower).createLoanRequest(assetToken.address, 1, loanAmount)
      )
        .to.emit(assetLendingPlatform, "LoanRequested")
        .withArgs(borrower.address, assetToken.address, 1, loanAmount);

      const loan = await assetLendingPlatform.getLoan(1);
      expect(loan.borrower).to.equal(borrower.address);
      expect(loan.collateralToken).to.equal(assetToken.address);
      expect(loan.collateralTokenId).to.equal(1);
      expect(loan.loanAmount).to.equal(loanAmount);
      expect(loan.state).to.equal(0); // Loan state: Requested
    });

    it("should allow a lender to accept a loan request", async function () {
      const loanId = 1;
      const loanAmount = ethers.utils.parseUnits("1000", 6);

      // Transfer StableUSD to lender and approve it for the lending platform
      await stableUSD.transfer(lender.address, loanAmount);
      await stableUSD.connect(lender).approve(assetLendingPlatform.address, loanAmount);

      await expect(assetLendingPlatform.connect(lender).acceptLoan(loanId))
        .to.emit(assetLendingPlatform, "LoanAccepted")
        .withArgs(lender.address, loanId);

      const loan = await assetLendingPlatform.getLoan(loanId);
      expect(loan.lender).to.equal(lender.address);
      expect(loan.state).to.equal(1); // Loan state: Accepted
    });

    it("should allow the borrower to repay the loan", async function () {
      const loanId = 1;
      const loanAmount = ethers.utils.parseUnits("1000", 6);

      // Transfer StableUSD to borrower and approve it for repayment
      await stableUSD.transfer(borrower.address, loanAmount);
      await stableUSD.connect(borrower).approve(assetLendingPlatform.address, loanAmount);

      await expect(assetLendingPlatform.connect(borrower).repayLoan(loanId))
        .to.emit(assetLendingPlatform, "LoanRepaid")
        .withArgs(borrower.address, loanId);

      const loan = await assetLendingPlatform.getLoan(loanId);
      expect(loan.state).to.equal(2); // Loan state: Repaid
    });

    it("should allow the lender to mark a loan as defaulted", async function () {
      // Create a new loan request
      await assetToken.connect(borrower).mint(borrower.address);
      await assetToken.connect(borrower).approve(assetLendingPlatform.address, 2);
      
      const newLoanAmount = ethers.utils.parseUnits("500", 6);
      await assetLendingPlatform.connect(borrower).createLoanRequest(assetToken.address, 2, newLoanAmount);

      // Lender accepts the new loan request
      await stableUSD.connect(lender).approve(assetLendingPlatform.address, newLoanAmount);
      await assetLendingPlatform.connect(lender).acceptLoan(2);

      // Simulate default scenario (in real use, a time period would pass here)
      await expect(assetLendingPlatform.connect(lender).markLoanDefaulted(2))
        .to.emit(assetLendingPlatform, "LoanDefaulted")
        .withArgs(lender.address, 2);

      const loan = await assetLendingPlatform.getLoan(2);
      expect(loan.state).to.equal(3); // Loan state: Defaulted
    });

    it("should not allow double acceptance of a loan", async function () {
      const loanId = 1;
      await expect(
        assetLendingPlatform.connect(lender).acceptLoan(loanId)
      ).to.be.revertedWith("Loan already accepted or not requested.");
    });

    it("should not allow double repayment of a loan", async function () {
      const loanId = 1;
      await expect(
        assetLendingPlatform.connect(borrower).repayLoan(loanId)
      ).to.be.revertedWith("Loan not accepted or already repaid.");
    });
  });
});