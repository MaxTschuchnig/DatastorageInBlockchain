import React, { Component } from 'react';
import './../../../App.css';

class AddComponent extends Component {
    constructor(props) {
        super(props);

        this.id = 0;
        this.seq = 0;

        console.log("This component adds Data in 10 Exponents and stops time until completion");
    }

    add_item_batch(amount) {
        this.getSequenceNbr();

        let batchSize = 10; //1000;
        let items = [];
        let rn = Math.random();
        let task = "";

        if (rn < 0.3)
            task = "add";
        else if (rn < 0.7)
            task = "edit";
        else
            task = "delete";

        for (let i = 0; i < batchSize; i ++) {
            items.push({
                _id: "id_" + this.id ++,
                _seq: this.state._seq ++,
                _editor: this.state.parent.state.user_address,
                _task: task
            });
        }

        /*
        let item = {
            _id: this.state._id,
            _seq: this.state._seq,
            _editor: this.state.parent.state.user_address,
            _task: 'add'
        };

        this.web3.extend({
            property: 'myAdmin',
            methods: [{
                name: 'unlock',
                call: 'personal_unlockAccount',
                params: 3,
            }]
        });

        this.web3.myAdmin.unlock(this.state.parent.state.user_address, 'maxi', 30)
            .then(result => {
                console.log('unlocked account... proceeding with task');
                let xhr = new XMLHttpRequest();
                xhr.open("POST", this.state.parent.state.url, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let json = JSON.parse(xhr.responseText);
                        console.log(json.result);
                    }
                };
                let data = this.web3.eth.abi.encodeFunctionCall({
                    name: 'setDbFunction',
                    type: 'function',
                    inputs: [{
                        type: 'string',
                        name: '_task'
                    }, {
                        type: 'string',
                        name: '_uuid_dataset'
                    }, {
                        type: 'string',
                        name: '_editor_name'
                    }, {
                        type: 'uint256',
                        name: 'seq'
                    }]
                }, [item._task, item._id, item._editor, item._seq]);

                data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_sendTransaction", "params": [{ "from": this.state.parent.state.user_address,"to": this.state.parent.state.contract_address, "gas":"0xF4240", "data": data}], "id":1});
                xhr.send(data);
            });
            */
    }

    getSequenceNbr() {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.state.parent.state.url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Get Json from Response Text
                let json = JSON.parse(xhr.responseText);

                while(json.result.charAt(0) === '0' || json.result.charAt(0) === 'x') {
                    json.result = json.result.substr(1);
                    if (json.result.length <= 1) {
                        break;
                    }
                }
                this.seq = parseInt(json.result, 16);
            }
        };

        let getAllStrings = this.web3.eth.abi.encodeFunctionCall({
            name: 'getLatestDbFunction',
            type: 'function',
            inputs: []
        });

        let data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_call", "params": [{ "to": this.state.parent.state.contract_address, "data": getAllStrings}, "latest"], "id":1});
        xhr.send(data);
    }

    render() {
        return (
            <div>
                Stress Test
            </div>
        );
    }
}

export default StressTest;