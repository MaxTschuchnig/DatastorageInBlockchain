const express = require('express');
const app = express();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://rndchain.tk:8545/'));


var accounts;
var gasPrice;

web3.eth.getAccounts((event, accounts) => {
    setAccounts(accounts);
});

web3.eth.getGasPrice((event, gasPrice) => {
    setGasPrice(gasPrice);
});

function setAccounts(_accounts) {
    accounts = _accounts;
}

function setGasPrice(_gasPrice) {
    gasPrice = _gasPrice;
}

// Contracts
var ticketControllerABI = [
    {
        "constant": false,
        "inputs": [
            {
                "name": "txt",
                "type": "string"
            },
            {
                "name": "c",
                "type": "address"
            }
        ],
        "name": "createTicket",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "tn",
                "type": "uint256"
            }
        ],
        "name": "getTicket",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "addresses",
        "outputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
];
var ticketControllerContractAddress = '0x63ffa90c257114af1096aa364dc160269c0a2f69';
var ticketControllerContract = new web3.eth.Contract(ticketControllerABI, ticketControllerContractAddress);
//var contractInstance = contract.at(contractAddress);


let personalDataABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "getCity",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getAddressCustomer",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getName",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getCountry",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getPlz",
        "outputs": [
            {
                "name": "",
                "type": "uint16"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "name": "_name",
                "type": "string"
            },
            {
                "name": "_addressCustomer",
                "type": "string"
            },
            {
                "name": "_plz",
                "type": "uint16"
            },
            {
                "name": "_city",
                "type": "string"
            },
            {
                "name": "_country",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    }
];
let personalDataContract = new web3.eth.Contract(personalDataABI);
let personalDataData = '0x6060604052341561000f57600080fd5b6040516107593803806107598339810160405280805182019190602001805182019190602001805190602001909190805182019190602001805182019190505084600090805190602001906100659291906100d2565b5082600160006101000a81548161ffff021916908361ffff16021790555081600390805190602001906100999291906100d2565b5083600290805190602001906100b09291906100d2565b5080600490805190602001906100c79291906100d2565b505050505050610177565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061011357805160ff1916838001178555610141565b82800160010185558215610141579182015b82811115610140578251825591602001919060010190610125565b5b50905061014e9190610152565b5090565b61017491905b80821115610170576000816000905550600101610158565b5090565b90565b6105d3806101866000396000f30060606040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680630379915d1461007257806316674c4b1461010057806317d7de7c1461018e5780639e0c3ead1461021c578063c5fc29b7146102aa575b600080fd5b341561007d57600080fd5b6100856102db565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100c55780820151818401526020810190506100aa565b50505050905090810190601f1680156100f25780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561010b57600080fd5b610113610383565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610153578082015181840152602081019050610138565b50505050905090810190601f1680156101805780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561019957600080fd5b6101a161042b565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101e15780820151818401526020810190506101c6565b50505050905090810190601f16801561020e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561022757600080fd5b61022f6104d3565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561026f578082015181840152602081019050610254565b50505050905090810190601f16801561029c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102b557600080fd5b6102bd61057b565b604051808261ffff1661ffff16815260200191505060405180910390f35b6102e3610593565b60038054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103795780601f1061034e57610100808354040283529160200191610379565b820191906000526020600020905b81548152906001019060200180831161035c57829003601f168201915b5050505050905090565b61038b610593565b60028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104215780601f106103f657610100808354040283529160200191610421565b820191906000526020600020905b81548152906001019060200180831161040457829003601f168201915b5050505050905090565b610433610593565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156104c95780601f1061049e576101008083540402835291602001916104c9565b820191906000526020600020905b8154815290600101906020018083116104ac57829003601f168201915b5050505050905090565b6104db610593565b60048054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105715780601f1061054657610100808354040283529160200191610571565b820191906000526020600020905b81548152906001019060200180831161055457829003601f168201915b5050505050905090565b6000600160009054906101000a900461ffff16905090565b6020604051908101604052806000815250905600a165627a7a72305820c734df6dd9e7912b4f945edefaf5da04486629374517bdda7a3921d5a020a6f70029';



var bodyParser = require('body-parser');
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies


app.get('/test', (req, res) => {
    let t = test.deploy({
        data: personalDataData,
        arguments: ['Anna', 5020, "hier", "sbg"]
    });
    console.log(t);
    console.log('in Test');
});

app.post('/register', (req, res) => {

    let dataArray = req.body.data.split(';');
    let newDataArray = [];
    dataArray.forEach((x) => {
        newDataArray.push(web3.utils.toHex(x));
    });
    console.log(newDataArray);
    personalDataContract.deploy({
        data: personalDataData,
        arguments: newDataArray
    }).send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: gasPrice
    }).on('receipt', (receipt) => {
        console.log(receipt.contractAddress);
    }).on('transactionHash', transactionHash => {
        console.log('transactionHash: ' + transactionHash);
    }).on('error', error => {
        console.log('error: '+ error);
    });

});

// Serve static files
app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});
app.get('/script.js', (req, res) => {
    res.sendFile(__dirname + '/public/script.js')
});
app.get('/logo.jpg', (req, res) => {
    res.sendFile(__dirname + '/public/logo.svg')
});
/*
app.get('/get-accounts', (req, res) => {
    var addressess = web3.eth.accounts;
    var accounts = [];
    for (var i = 0; i < addressess.length; i++) {
        accounts.push({
            address: addressess[i],
            balance: web3.eth.getBalance(addressess[i]) / 100000
        });
    }
    res.send(JSON.stringify(accounts));
});

app.get('/get-data', (req, res) => {
    var data = contractInstance.get.call();
    console.log(data);
    res.send(JSON.stringify({data: data}));
});

app.get('/get-sc-address', (req, res) => {
    res.send(JSON.stringify({address: contractAddress}));
});
app.get('/get-sc-abi', (req, res) => {
    res.send(JSON.stringify(ABI));
});
app.get('/get-sc-source', (req, res) => {
    res.send(JSON.stringify({source: "pragma solidity ^0.4.0;\n\ncontract TestContract {\n    address private owner;\n    bytes32 private data;\n    \n    modifier isOwner() {\n        require(owner == msg.sender);\n        _;\n    }\n    \n    function TestContract() public {\n        owner = msg.sender;    \n    }\n    \n    function setData(bytes32 _data) isOwner public {\n        data = _data;\n    }\n    \n    function get() public constant returns(bytes32) {\n        return data;\n    }\n}"}));
});

app.post('/set-data', (req, res) => {
    var input = req.body.data.toString();
    console.log('input: ' + input);
    console.log(req.body.address);
    contractInstance.setData(input, {
            from: req.body.address,
            value: 0,
            gas: 3000000
        },
        function (err, result) {
            if (err == null) {
                res.send(JSON.stringify({success: true}));
            } else {
                res.send(JSON.stringify({success: false}));
            }
        });
});
*/

app.listen(3000);
