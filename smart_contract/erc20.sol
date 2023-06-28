// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract erc20mint is ERC20 {

 event Transfers(address from,address to,uint tokens);
 event Mint(uint tokens);

 constructor() ERC20("NFT", "MTK") {}

 function mint(uint256 amount) public {
 _mint(msg.sender,amount);
 emit Mint(amount);
 }
 
 function TransferToken( address _to, uint256 amount) public {
 transfer(_to, amount);
 emit Transfers(msg.sender,_to,amount);
 }
}