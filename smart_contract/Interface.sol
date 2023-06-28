// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface contract_interface{
    function PlaceOrder(address token_address,address seller,uint256 token_Id,uint256 num_coppies,uint256 pricePerNFT,address paymentToken) external;
}