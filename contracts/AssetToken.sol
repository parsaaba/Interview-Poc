// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AssetToken is ERC721, Ownable {
    uint256 public currentTokenId;
    uint256 public maxSupply;
    string public baseTokenURI;

    struct TokenData {
        uint256 tokenId;
        string tokenURI;
    }

    // Use mappings to store balances and URIs separately to reduce function complexity
    mapping(address => uint256) public balances;
    mapping(uint256 => string) public tokenURIs;

    // Consolidate constructor parameters into a struct
    struct InitParams {
        uint256 _maxSupply;
        string _baseTokenURI;
    }

    constructor(address initialOwner, InitParams memory params) 
        ERC721("AssetToken", "AST") 
        Ownable(initialOwner) 
    {
        maxSupply = params._maxSupply;
        baseTokenURI = params._baseTokenURI;
    }

    function mint(address to) public onlyOwner {
        require(currentTokenId < maxSupply, "Max supply reached");
        _mintToken(to);
    }

    // Separate the minting logic into a smaller, internal function
    function _mintToken(address to) internal {
        currentTokenId++;
        _safeMint(to, currentTokenId);
        _updateBalance(to);
    }

    // Separate the balance update logic
    function _updateBalance(address to) internal {
        balances[to]++;
    }

    function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
        tokenURIs[tokenId] = tokenURI;
    }

    function batchSetTokenURIs(TokenData[] memory tokens) public onlyOwner {
        for (uint256 i = 0; i < tokens.length; i++) {
            tokenURIs[tokens[i].tokenId] = tokens[i].tokenURI;
        }
    }
}