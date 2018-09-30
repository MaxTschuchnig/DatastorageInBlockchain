const express = require('express');
const app = express();
const Web3 = require('web3');
//const web3 = new Web3(new Web3.providers.HttpProvider('http://rndchain.tk:1337'));
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));

// Contracts
var ticketControllerABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "getAllTickets",
        "outputs": [
            {
                "name": "",
                "type": "address[]"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "txt",
                "type": "string"
            },
            {
                "name": "technician",
                "type": "string"
            },
            {
                "name": "due_date",
                "type": "string"
            }
        ],
        "name": "createTicket",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getTicketNumber",
        "outputs": [
            {
                "name": "",
                "type": "int256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
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
        "stateMutability": "view",
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
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "tn",
                "type": "uint256"
            }
        ],
        "name": "ticketNr",
        "type": "event"
    }
];
var ticketControllerContractAddress = '0x232e5eca48b7b6aed624b315d171d91bc88999cc';
var ticketControllerContract = new web3.eth.Contract(ticketControllerABI, ticketControllerContractAddress);

var accounts;
var gasPrice;

// accounts = [web3.eth.accounts.privateKeyToAccount('0c03891decc0490f49126c452f8e0f4bd0ce489ee06fd478c91fae8be0a6dbfd')];

web3.eth.getGasPrice((event, gasPrice) => {
    setGasPrice(gasPrice);
});


web3.eth.getAccounts((event, accounts) => {
    setAccounts(accounts);
});

function setAccounts(_accounts) {
    accounts = _accounts;
}

function setGasPrice(_gasPrice) {
    gasPrice = _gasPrice;
}


//var contractInstance = ticketControllerContract.at(ticketControllerContractAddress);


function getMinedTicketCount(ticketamount) {
    const transactionObject = {
        from: accounts[1],
        gas: 1500000,
        gasPrice: gasPrice
    };
    ticketControllerContract.methods.getTicketNumber().call(transactionObject)
        .then(res => {
            let x = parseInt(res);
            console.log('mined tickets: ' + x);
            if (x == ticketamount) {
                console.log('\n\n\n');
                console.timeEnd(ticketamount + '-tickets');
                console.log('\n\n\n');
            } else if (x < ticketamount) {
                sleep(50);
                getMinedTicketCount(ticketamount);
            } else {
                console.log('there is sumfing wrong...');
            }
        })
        .catch(e => console.log('error!!!!!: ' + e));
}

/*
function stopTimer(ticketamount) {
    let x = getMinedTicketCount()+1;
    console.log('mined tickets: ' + x);
    if (x == ticketamount) {
        console.log('\n\n\n');
        console.timeEnd(ticketamount + '-tickets');
        console.log('\n\n\n');
    } else if (x < ticketamount) {
        stopTimer(ticketamount);
    } else {
        console.log('there is sumfing wrong...');
    }
}
*/

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

function sendTicket(currentTicket, ticketamount) {
    const transactionObject = {
        from: accounts[1],
        gas: 1500000,
        gasPrice: gasPrice
    };
    ticketControllerContract.methods.createTicket('Aufgabe', 'Techniker', '28.12.2020').send(transactionObject)
        .then(res => {
            console.log('created ticket #' + currentTicket + ': ' + res);
            currentTicket = currentTicket + 1;

            if (currentTicket < ticketamount) {
                sendTicket(currentTicket, ticketamount);
            } else {
                getMinedTicketCount(ticketamount);
            }
        })
        .catch(e => console.log('error!!!!!: ' + e));

}

app.get('/eval', (req, res, next) => {

    var ticketamount = 1000;


    //for (let j = 0; j < 3; j++) {
    //ticketamount = ticketamount * 10;
    console.log('now evaluating ' + ticketamount + ' tickets');
    console.time(ticketamount + '-tickets');
    let currentTicket = 0;

    if (currentTicket < ticketamount) {
        sendTicket(currentTicket, ticketamount);
    }

    //}

    res.end('{"success" : "Created Ticket", "status" : 200}');
});


app.listen(3000);
