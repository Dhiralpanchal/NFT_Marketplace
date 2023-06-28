// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./nft1155.sol";
import "./erc20.sol";
import "./Interface.sol";




contract Escrow is ERC1155Holder{

 using Counters for Counters.Counter;
 Counters.Counter public ordernumber;
 
 address public tokenaddr;
 struct Order{
 address seller;
 uint256 token_Id;
 uint256 numberOfCoppies;
 uint256 pricePerNFT;
 SaleType saletypes;
 address paymentToken;
 uint256 timestamp;
 
 }
 
 struct Bid{
 address bidder;
 uint256 bidValue;
 uint256 timestamp;
 }
 
 
 
 //Mapping to map order structure wth order number
 mapping(uint256 =>Order) public ordersdetail;
 //Created mapping to map bid with bid number
 mapping (uint256 => Bid) public bidsdetail;
 //Create mapping to map tokenCopies with token ID
 mapping (uint256 => uint256) public copies;

 
 event orderplace(address seller,uint256 order_number,uint256 timestamp);
 event bidplace(uint256 order_number,address bidder,uint256 bidValue,uint256 timestamp);
 event orderbought(uint256 order_number,uint256 numberOfCoppies,uint256 timestamp,address buyer);

 function PlaceOrder(address token_address,address seller,uint256 token_Id,uint256 num_coppies,uint256 pricePerNFT,address paymentToken) public{
 ordernumber.increment();
 uint256 order_number = ordernumber.current();
 
 ordersdetail[order_number]=Order (
 seller,
 token_Id,
 num_coppies,
 pricePerNFT,
 GetSaletype(token_address, token_Id),
 paymentToken,
 block.timestamp
 );
 copies [order_number] += num_coppies;
 
 ERC1155(token_address).safeTransferFrom(seller, address(this), token_Id, num_coppies, "" );
 emit orderplace(msg.sender,order_number,block.timestamp);

 }
 
 function BuyNow(address token_address,uint256 order_number,uint256 num_coppies)public payable{
 
 Order storage orders = ordersdetail[order_number];
 require(orders.saletypes == SaleType.Instant, "saletype is invalid");
 require(orders.seller != msg.sender,"buyer can not be seller");
 // require(msg.value == orders.pricePerNFT*num_coppies,"invalid amount sent");
 if (orders.paymentToken != address(0)) {
 require(IERC20(orders.paymentToken).balanceOf(msg.sender) >= orders.pricePerNFT*num_coppies, "Insufficient payment token balance");
 require(IERC20(orders.paymentToken).transferFrom(msg.sender, orders.seller, orders.pricePerNFT*num_coppies), "Payment token transfer failed");
 }
 else
 {
 require(msg.value == orders.pricePerNFT*num_coppies, "Invalid amount sent");
 payable(orders.seller).transfer(msg.value);
 }
 ERC1155(token_address).safeTransferFrom(address(this), msg.sender, orders.token_Id,num_coppies, ""); 
 ordersdetail[order_number].numberOfCoppies -= num_coppies; 
 }
 
 function placeBid(uint256 order_number,uint256 bid_value) public{
 Order storage orders = ordersdetail[order_number];
 
 require(orders.seller != msg.sender,"saller can not place bid");
 require(orders.saletypes == SaleType.Auction, "saletype is invalid");
 require(bid_value > orders.pricePerNFT * orders.numberOfCoppies ,"Invalid price");
 require( bid_value > bidsdetail[order_number].bidValue , "Bid should be higher, Bid high amount" );
 

 //Check price of bid from bid structure also based on order number, bid value
 Bid storage bids = bidsdetail[order_number]; 
 //update bidstructure
 bids.bidder=msg.sender;
 bids.bidValue=bid_value;
 bids.timestamp=block.timestamp;
 emit bidplace(order_number,msg.sender,bid_value,block.timestamp);

 }
 function claimBid(address token_address,uint256 order_number) public payable{
 Order storage orders = ordersdetail[order_number];
 Bid storage bids = bidsdetail[orders.token_Id];
 require(bids.bidder == msg.sender , "You can not claim.");
 uint256 bidValue = bids.bidValue;
 //require(msg.value == bidValue ," enter correct bid value.");
 if (orders.paymentToken != address(0)) {
 require(IERC20(orders.paymentToken).balanceOf(msg.sender) >= bidValue,"Insufficient balance");
 } 
 else{
 require(msg.value == bidValue,"enter correct bid value");
 payable(orders.seller).transfer(msg.value);
 } 
 ERC1155(token_address).safeTransferFrom(address(this), msg.sender, orders.token_Id, orders.numberOfCoppies, "");
 emit orderbought(order_number,orders.numberOfCoppies,block.timestamp, msg.sender);
 ordersdetail[order_number].numberOfCoppies = 0;
 }

 function GetSaletype(address token_add,uint256 token_id) private view returns(SaleType){
 return nft1155(token_add).getSaletype(token_id);
 }
}