// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract AssetLendingPlatform is IERC721Receiver {
    struct Loan {
        uint32 id;
        address borrower;
        address nftContract;
        uint256 tokenId;
        address collateralToken;
        uint256 principal;
        uint256 interestRate;
        uint256 startTime;
        uint256 duration;
        address lender;
        bool isAccepted;
        bool isRepaid;
        bool isDefaulted;
    }

    uint32 public loanIdCounter;
    uint256 public baseInterestRate = 1000; // Base interest rate (in basis points).
    mapping(uint32 => Loan) public activeLoans;
    mapping(address => bool) public approvedTokens;
    mapping(address => bool) public approvedNFTs;

    event LoanRequested(
        uint32 loanId,
        address borrower,
        address collateralToken,
        uint256 principal,
        address nftContract,
        uint256 tokenId
    );
    event LoanFunded(uint32 loanId, address lender);
    event LoanRepaid(uint32 loanId, uint256 totalRepayment);
    event LoanDefaulted(uint32 loanId);

    modifier onlyApprovedTokens(address tokenAddress) {
        require(approvedTokens[tokenAddress], "Token not approved");
        _;
    }

    modifier onlyApprovedNFTs(address nftAddress) {
        require(approvedNFTs[nftAddress], "NFT not approved");
        _;
    }

    modifier onlyBorrower(uint32 loanId) {
        require(activeLoans[loanId].borrower == msg.sender, "Not the loan borrower");
        _;
    }

    modifier onlyLender(uint32 loanId) {
        require(activeLoans[loanId].lender == msg.sender, "Not the loan lender");
        _;
    }

    constructor(address initialApprovedToken) {
        approvedTokens[initialApprovedToken] = true;
    }

    function initiateLoan(
        address collateralToken,
        uint256 principalAmount,
        address nftContract,
        uint256 tokenId,
        uint256 duration
    ) external onlyApprovedNFTs(nftContract) {
        IERC721 nft = IERC721(nftContract);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the NFT owner");

        loanIdCounter++;
        activeLoans[loanIdCounter] = Loan({
            id: loanIdCounter,
            borrower: msg.sender,
            nftContract: nftContract,
            tokenId: tokenId,
            collateralToken: collateralToken,
            principal: principalAmount,
            interestRate: baseInterestRate,
            startTime: block.timestamp,
            duration: duration,
            lender: address(0),
            isAccepted: false,
            isRepaid: false,
            isDefaulted: false
        });

        nft.safeTransferFrom(msg.sender, address(this), tokenId);

        emit LoanRequested(
            loanIdCounter,
            msg.sender,
            collateralToken,
            principalAmount,
            nftContract,
            tokenId
        );
    }

    function fundLoan(uint32 loanId)
        external
        onlyApprovedTokens(activeLoans[loanId].collateralToken)
    {
        Loan storage loan = activeLoans[loanId];
        require(!loan.isAccepted, "Loan already funded");

        IERC20 token = IERC20(loan.collateralToken);
        require(
            token.transferFrom(msg.sender, loan.borrower, loan.principal),
            "Funding failed"
        );

        loan.isAccepted = true;
        loan.lender = msg.sender;

        emit LoanFunded(loanId, msg.sender);
    }

    function settleLoan(uint32 loanId) external onlyBorrower(loanId) {
        Loan storage loan = activeLoans[loanId];
        require(loan.isAccepted, "Loan not yet funded");
        require(!loan.isRepaid, "Loan already repaid");

        uint256 repaymentAmount = calculateRepayment(loan);
        IERC20 token = IERC20(loan.collateralToken);
        require(
            token.transferFrom(msg.sender, loan.lender, repaymentAmount),
            "Repayment failed"
        );

        IERC721 nft = IERC721(loan.nftContract);
        nft.safeTransferFrom(address(this), loan.borrower, loan.tokenId);

        loan.isRepaid = true;

        emit LoanRepaid(loanId, repaymentAmount);
    }

    function declareDefault(uint32 loanId) external onlyLender(loanId) {
        Loan storage loan = activeLoans[loanId];
        require(!loan.isDefaulted, "Loan already defaulted");
        require(block.timestamp > loan.startTime + loan.duration, "Loan duration not exceeded");

        IERC721 nft = IERC721(loan.nftContract);
        nft.safeTransferFrom(address(this), loan.lender, loan.tokenId);

        loan.isDefaulted = true;

        emit LoanDefaulted(loanId);
    }

    function calculateRepayment(Loan memory loan) internal view returns (uint256) {
        uint256 interest = (loan.principal * loan.interestRate * (block.timestamp - loan.startTime)) / (10000 * loan.duration);
        return loan.principal + interest;
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}