import React, { Component } from 'react';
import Web3 from 'web3';
import sjcl from 'sjcl';
import { Divider, Input, Button } from 'semantic-ui-react';
import Center from 'react-center';
import './../../../App.css';

class AddComponent extends Component {
    constructor(props) {
        super(props);

        this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));
        window.web3 = this.web3; // Available in web console

        this.state = {
            parent: props.parent,
            _id: "",
            _seq: -1,
            task: "",
            technician: "",
            due_date: ""
        };


        this.handleChange = this.handleChange.bind(this);
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

                this.setState({
                    _seq: parseInt(json.result, 16)
                });
                this.hashObject();
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

    hashObject() {
        let ticket = {
            task: this.state.task,
            technician: this.state.technician,
            due_date: this.state.due_date
        };

        let item = {
            _seq: this.state._seq,
            _editor: this.state.parent.state.user_address,
            _task: 'add',
            data: ticket
        };

        this.setState({
            _id: '1-' + this.getHash(item)
        });
        this.add_item_idb(this.state.parent);
        this.add_item_bc();
    }

    getHash(object) {
        // Should be salted!
        let bitArray = sjcl.hash.sha256.hash(JSON.stringify(object));
        return sjcl.codec.hex.fromBits(bitArray);
    }

    add_item_idb(ref) {
        let transaction = ref.db.transaction(["data"], "readwrite");
        let ticket = {
            task: this.state.task,
            technician: this.state.technician,
            due_date: this.state.due_date
        };

        let item = {
            _id: this.state._id,
            _seq: this.state._seq,
            _editor: this.state.parent.state.user_address,
            _task: 'add',
            data: ticket
        };

        // Do something when all the data is added to the database.
        transaction.oncomplete = event => {
            console.log("Data added: " + JSON.stringify(item));
        };

        transaction.onerror = event => {
            console.log("Error adding " + JSON.stringify(item));
            console.log(event);
        };

        let objectStore = transaction.objectStore("data");
        let request = objectStore.add(item);
        request.onsuccess = function(event) {
            console.log("success");
        };
    }

    add_item_bc() {
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
    }

    all_in_one() {
        this.getSequenceNbr();
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div>
                <Divider horizontal className="mm">Adding</Divider>
                <Center>
                    <Input name="task" type="text" value={this.state.task} onChange={this.handleChange}
                           className="mm" placeholder='task...' />
                    <Input name="technician" type="text" value={this.state.technician} onChange={this.handleChange}
                           className="mm" placeholder='technician...' />
                    <Input name="due_date" type="text" value={this.state.due_date} onChange={this.handleChange}
                           className="mm" placeholder='due date...' />
                    <Button onClick={() => this.all_in_one()} className='mm'>Submit</Button>
                </Center>
            </div>
        );
    }
}

export default AddComponent;