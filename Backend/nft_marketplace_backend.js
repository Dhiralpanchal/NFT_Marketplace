const Web3 = require('web3');
require('dotenv').config()

const erc20 = process.env.ERC20;
const escrow = process.env.ESCROW;
const mint_erc1155 = process.env.MINTERC1155;

const gaurav_wallet = process.env.GAURAV_WALLET;
const wallet = process.env.ACCOUNT_ADDRESS;

const erc20_abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "Mint",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokens",
				"type": "uint256"
			}
		],
		"name": "Transfers",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TransferToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "subtractedValue",
				"type": "uint256"
			}
		],
		"name": "decreaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "addedValue",
				"type": "uint256"
			}
		],
		"name": "increaseAllowance",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const minterc1155_abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_paymentTokenAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_escrowTokenAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			},
			{
				"indexed": false,
				"internalType": "uint256[]",
				"name": "values",
				"type": "uint256[]"
			}
		],
		"name": "TransferBatch",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "TransferSingle",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "value",
				"type": "string"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "URI",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "EscrowTokenAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "accounts",
				"type": "address[]"
			},
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			}
		],
		"name": "balanceOfBatch",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "disablePaymentToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "enablePaymentToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenID",
				"type": "uint256"
			}
		],
		"name": "getSaletype",
		"outputs": [
			{
				"internalType": "enum SaleType",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_Id",
				"type": "uint256"
			}
		],
		"name": "geturi",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "numberOfCoppies",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "tokenURI",
				"type": "string"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			},
			{
				"internalType": "enum SaleType",
				"name": "saletypes",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "pricePerNFT",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "token_address",
				"type": "address"
			}
		],
		"name": "mint",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amounts",
				"type": "uint256[]"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "mintBatch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paymentToken",
		"outputs": [
			{
				"internalType": "contract IERC20",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paymentTokensEnabled",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "ids",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "amounts",
				"type": "uint256[]"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeBatchTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "token_Id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "newuri",
				"type": "string"
			}
		],
		"name": "setURI",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_paymentToken",
				"type": "address"
			}
		],
		"name": "set_Paymenttoken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "tokeninfo",
		"outputs": [
			{
				"internalType": "string",
				"name": "tokenURI",
				"type": "string"
			},
			{
				"internalType": "enum SaleType",
				"name": "saleTypes",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "pricePerNFT",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "numberOfCoppies",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "paymentTokensEnabled",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "uri",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

const escrow_abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "order_number",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "bidValue",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "bidplace",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "order_number",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "numberOfCoppies",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "orderbought",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "order_number",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "orderplace",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token_address",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "order_number",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "num_coppies",
				"type": "uint256"
			}
		],
		"name": "BuyNow",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token_address",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "token_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "num_coppies",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pricePerNFT",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "paymentToken",
				"type": "address"
			}
		],
		"name": "PlaceOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "bidsdetail",
		"outputs": [
			{
				"internalType": "address",
				"name": "bidder",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "bidValue",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "token_address",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "order_number",
				"type": "uint256"
			}
		],
		"name": "claimBid",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "copies",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "onERC1155BatchReceived",
		"outputs": [
			{
				"internalType": "bytes4",
				"name": "",
				"type": "bytes4"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "",
				"type": "bytes"
			}
		],
		"name": "onERC1155Received",
		"outputs": [
			{
				"internalType": "bytes4",
				"name": "",
				"type": "bytes4"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "ordernumber",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_value",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "ordersdetail",
		"outputs": [
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "token_Id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "numberOfCoppies",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pricePerNFT",
				"type": "uint256"
			},
			{
				"internalType": "enum SaleType",
				"name": "saletypes",
				"type": "uint8"
			},
			{
				"internalType": "address",
				"name": "paymentToken",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "order_number",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "bid_value",
				"type": "uint256"
			}
		],
		"name": "placeBid",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "tokenaddr",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

//plug in web3 provider
//const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PROVIDER));
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.PROVIDER));
const contract_erc20 = new web3.eth.Contract(erc20_abi, erc20);
const contract_escrow = new web3.eth.Contract(escrow_abi, escrow);
const contract_erc1155 = new web3.eth.Contract(minterc1155_abi, mint_erc1155);

const mint_token = async () => {
    try {

        const gaSPrice = await web3.eth.getGasPrice();
        console.log("gas price", gaSPrice);

        const nonce = await web3.eth.getTransactionCount(wallet);
        console.log("nonce is", nonce);

       // const gaslimit = await contract_erc1155.estimateGas.mint(token_Id, numberOfCoppies,tokenURI,Data,SaleType,pricePerNFT,token_address)
       // console.log(gaslimit.toNumber());

        const token_Id = 2;
        const numberOfCoppies = 500;
        const tokenURI = "https://gateway.pinata.cloud/ipfs/QmZw4ovpK3N1CSNLYwjgAa5a4VYHdmiqtC3U6UHQRFgchv";
        const Data = "abc";
        const SaleType = 1;
        const pricePerNFT = 200;
        token_address = mint_erc1155;
        
        const tx = {
            from: wallet,
            to: mint_erc1155,
            gasPrice: gaSPrice,
            gasLimit: 500000,
            nonce: nonce,
            data: contract_erc1155.methods.mint(token_Id, numberOfCoppies,tokenURI,Data,SaleType,pricePerNFT,token_address).encodeABI()
        };

        console.log("trasaction ", tx);
        // Sign the transaction with the private key
        const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

        // // Send the signed transaction to the network
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);


    }

    catch (err) {
        console.log(err);
    }
};
//mint_token()

const enable_paymenttoken = async () => {
    try {

        const gaSPrice = await web3.eth.getGasPrice();
        console.log("gas price", gaSPrice);

        const nonce = await web3.eth.getTransactionCount(wallet);
        console.log("nonce is", nonce);

       // const gaslimit = await contract_erc1155.estimateGas.mint(token_Id, numberOfCoppies,tokenURI,Data,SaleType,pricePerNFT,token_address)
       // console.log(gaslimit.toNumber());

        
        const tx = {
            from: wallet,
            to: mint_erc1155,
            gasPrice: gaSPrice,
            gasLimit: 500000,
            nonce: nonce,
            data: contract_erc1155.methods.enablePaymentToken().encodeABI()
        };

        console.log("trasaction ", tx);
        // Sign the transaction with the private key
        const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.PRIVATE_KEY);

        // // Send the signed transaction to the network
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);


    }

    catch (err) {
        console.log(err);
    }
};
//enable_paymenttoken()
const paymenttoken_mint = async () => {
    try {

        const gaSPrice = await web3.eth.getGasPrice();
        console.log("gas price", gaSPrice);

        const nonce = await web3.eth.getTransactionCount(gaurav_wallet);
        console.log("nonce is", nonce);

        
        const tx = {
            from:gaurav_wallet,
            to: erc20,
            gasPrice: gaSPrice,
            gasLimit: 400000,
            nonce: nonce,
            data:  contract_erc20.methods.mint(100000).encodeABI()
        };

        console.log("trasaction ", tx);
        // Sign the transaction with the private key
        const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.GAURAV_PRIVATEKEY);

        // // Send the signed transaction to the network
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);


    }

    catch (err) {
        console.log(err);
    }
};
//paymenttoken_mint()


const bid_Placed = async () => {
    try {

        const gaSPrice = await web3.eth.getGasPrice();
        console.log("gas price", gaSPrice);

        const nonce = await web3.eth.getTransactionCount(gaurav_wallet);
        console.log("nonce is", nonce);

        const order_number = 1;
        const bid_value =55000 ;
       
        const tx = {
            from:gaurav_wallet,
            to: escrow,
            gasPrice: gaSPrice,
            gasLimit: 500000,
            nonce: nonce,
            data:  contract_escrow.methods.placeBid(order_number,bid_value).encodeABI()
        };

        console.log("trasaction ", tx);
        // Sign the transaction with the private key
        const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.GAURAV_PRIVATEKEY);

        // // Send the signed transaction to the network
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);


    }

    catch (err) {
        console.log(err);
    }
};
//bid_Placed()
const give_allowance = async() =>{
    try {

        const gaSPrice = await web3.eth.getGasPrice();
        console.log("gas price", gaSPrice);

        const nonce = await web3.eth.getTransactionCount(gaurav_wallet);
        console.log("nonce is", nonce);

        const token_address = escrow;
        
       
        const tx = {
            from:gaurav_wallet,
            to: erc20,
            gasPrice: gaSPrice,
            gasLimit: 500000,
            nonce: nonce,
            data:  contract_erc20.methods.approve(token_address,100000).encodeABI()
        };

        console.log("trasaction ", tx);
        // Sign the transaction with the private key
        const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.GAURAV_PRIVATEKEY);

        // // Send the signed transaction to the network
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);


    }

    catch (err) {
        console.log(err);
    }

}
//give_allowance()
const claim_Placed = async () => {
    try {

        const gaSPrice = await web3.eth.getGasPrice();
        console.log("gas price", gaSPrice);

        const nonce = await web3.eth.getTransactionCount(gaurav_wallet);
        console.log("nonce is", nonce);

        const token_address = mint_erc1155;
        const order_number = 1;
       
        const tx = {
            from:gaurav_wallet,
            to: escrow,
            gasPrice: gaSPrice,
            gasLimit: 40000,
            nonce: nonce,
            data:  contract_escrow.methods.claimBid(token_address,order_number).encodeABI()
        };
        
        console.log("trasaction ", tx);
	
        // Sign the transaction with the private key
        const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.GAURAV_PRIVATEKEY);

        // // Send the signed transaction to the network
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);


    }

    catch (err) {
        console.log(err);
    }
};
//claim_Placed()

const buy_token = async () => {
    try {

        const gaSPrice = await web3.eth.getGasPrice();
        console.log("gas price", gaSPrice);

        const nonce = await web3.eth.getTransactionCount(gaurav_wallet);
        console.log("nonce is", nonce);

        const token_address = mint_erc1155 ;
        const order_number = 2;
        const copyNumber = 400;
       
        const tx = {
            from:gaurav_wallet,
            to: escrow,
            gasPrice: gaSPrice,
            gasLimit: 400000,
            nonce: nonce,
            data:  contract_escrow.methods.BuyNow(token_address,order_number,copyNumber).encodeABI()
        };

        console.log("trasaction ", tx);
        // Sign the transaction with the private key
        const signedTx = await web3.eth.accounts.signTransaction(tx, process.env.GAURAV_PRIVATEKEY);

        // // Send the signed transaction to the network
        const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log(receipt);


    }

    catch (err) {
        console.log(err);
    }
};
//buy_token()
