// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Interface.sol";
pragma solidity ^0.8.10;


enum SaleType{

 Auction,
 Instant
 }
 
contract nft1155 is ERC1155, Ownable {

 address private admin;
 address public EscrowTokenAddress;
 IERC20 public paymentToken;
 bool public paymentTokensEnabled = true;


 constructor(address _paymentTokenAddress,address _escrowTokenAddress) ERC1155("") {
 admin=msg.sender;
 paymentToken = IERC20(_paymentTokenAddress);
 EscrowTokenAddress = _escrowTokenAddress;
 }
 
 struct tokenInfo{
 
 string tokenURI;
 SaleType saleTypes;
 uint256 pricePerNFT;
 address tokenAddress;
 uint256 numberOfCoppies;
 bool paymentTokensEnabled;
 }
 
 mapping(uint256 => string) private _uries;
 mapping(uint256 =>tokenInfo) public tokeninfo;

 function setURI(uint256 token_Id,string memory newuri) public onlyOwner {
 _uries[token_Id]=newuri;
 }
 
 function geturi(uint256 token_Id) public view returns(string memory )
 {
 return _uries[token_Id];
 } 
 

 function mint(uint256 token_Id, uint256 numberOfCoppies,string memory tokenURI,bytes memory data,SaleType saletypes,uint256 pricePerNFT,address token_address)
 public
 
 {
 require(numberOfCoppies > 0 ,"It should be greater than zero");
 require(pricePerNFT > 0,"It should be greater than zero");
 require(bytes(tokenURI).length > 0, "Token URI should not be empty");
 require(saletypes == SaleType.Auction || saletypes == SaleType.Instant,"token type is invalid");

 _mint(msg.sender, token_Id,numberOfCoppies, data);

 
 tokeninfo[token_Id] = tokenInfo(
 tokenURI,
 saletypes,
 pricePerNFT,
 address (paymentToken),
 numberOfCoppies,
 paymentTokensEnabled
 );
 setApprovalForAll(EscrowTokenAddress,true);
 // Escrow(EscrowTokenAddress).PlaceOrder(address(this),msg.sender,token_Id,numberOfCoppies,pricePerNFT,saletypes,token_address);
 contract_interface(EscrowTokenAddress).PlaceOrder( address(this) , msg.sender , token_Id,numberOfCoppies, pricePerNFT,token_address); 
 }

 function set_Paymenttoken(address _paymentToken) external onlyOwner {
 require(_paymentToken != address(0),"Invalid payment token address"); 
 paymentToken = IERC20(_paymentToken);
 }

 function enablePaymentToken()external onlyOwner{
 require(!paymentTokensEnabled, "Payment token is enabled" );
 paymentTokensEnabled = true;
 }
 
 function disablePaymentToken() public onlyOwner{
 require(paymentTokensEnabled,"payment token is disable");
 paymentTokensEnabled = false;
 }

 function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
 public
 onlyOwner
 {
 _mintBatch(to, ids, amounts, data);
 }
 
 
 function getSaletype(uint256 tokenID) public view returns(SaleType)
 {
 SaleType a= tokeninfo[tokenID].saleTypes;
 return a;
 }
 
}
