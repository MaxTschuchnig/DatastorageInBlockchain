import React, { Component } from 'react';
import Web3 from 'web3';
import sjcl from 'sjcl';
import { Button, Input, Divider, Table, Dropdown } from 'semantic-ui-react';
import Center from 'react-center';
import './../../App.css'

class EthComponent extends Component {
    constructor(props) {
        super(props);

        this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));
        window.web3 = this.web3; // Available in web console

        this.state = {
            url: "http://localhost:8545",
            contract_address: "",
            user_address: "",
            task: "",
            bc_values: [],
            temp_values: []
        };

        this.taskOptions = [
            { key: 1, text: 'Add', value: 'Add' },
            { key: 2, text: 'Edit', value: 'Edit' },
            { key: 3, text: 'Delete', value: 'Delete' },
        ];

        this.handleChange = this.handleChange.bind(this);
        this.selectGroup = this.selectGroup.bind(this);
        this.sendDbEntry = this.sendDbEntry.bind(this);
    }

    convertToHex(toByteArray) {
        let retBytes = this.web3.utils.fromAscii(toByteArray, 32);
        return retBytes;
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    sendDbEntry(event) {
        this.web3.extend({
            property: 'myAdmin',
            methods: [{
                name: 'unlock',
                call: 'personal_unlockAccount',
                params: 3,
            }]
        });

        this.web3.myAdmin.unlock(this.state.user_address, 'maxi', 30)
            .then(result => {
                console.log('unlocked account...');
                let xhr = new XMLHttpRequest();
                xhr.open("POST", this.state.url, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        let json = JSON.parse(xhr.responseText);
                        console.log(json.result);
                    }
                };

                let obj = {
                    task: this.state.task,
                    editor_name: this.state.editor_name
                };

                let data = this.web3.eth.abi.encodeFunctionCall({
                        name: 'setDbFunction',
                        type: 'function',
                        inputs: [{
                            type: 'bytes32',
                            name: '_task'
                        }, {
                            type: 'bytes32',
                            name: '_uuid_dataset'
                        }, {
                            type: 'bytes32',
                            name: '_editor_name'
                        }]
                    }, [this.convertToHex(this.state.task), '0x' + this.getHash(obj), this.state.user_address]);

                    data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_sendTransaction", "params": [{ "from": this.state.user_address,"to": this.state.contract_address, "gas":"0xF4240", "data": data}], "id":1});
                xhr.send(data);
            });
    }

    unlock() {
        this.web3.extend({
            property: 'myAdmin',
            methods: [{
                name: 'unlock',
                call: 'personal_unlockAccount',
                params: 3,
            }]
        });

        this.web3.myAdmin.unlock(this.state.user_address, 'maxi', 30)
            .then(result => {
                console.log('unlocked account...');
            });
    }

    getEntriesFromToNoDelete(from, to) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.state.url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Get Json from Response Text
                let json = JSON.parse(xhr.responseText);
                this.parseEntriesJsonFromTo(json, from, to);
            }
        };

        let getAllStrings = this.web3.eth.abi.encodeFunctionCall({
            name: 'checkParametersGetDbFunctionsFromTo',
            type: 'function',
            inputs: [{
                type: 'uint256',
                name: 'from'
            }, {
                type: 'uint256',
                name: 'to'
            }]
        }, [from, to]);

        let data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_call", "params": [{ "to": this.state.contract_address, "data": getAllStrings}, "latest"], "id":1});
        xhr.send(data);
    }

    getAllEntriesStep(entries) {
        this.setState({
            bc_values: []
        });
        let from = 0;
        let to = 0;
        for (let i = 1; i < entries; i ++) {
            if (i % 10 === 0) {
                to = i;
                this.getEntriesFromToNoDelete(from, to);
                from = to;
            }
        }
        this.getEntriesFromToNoDelete(from, entries);
    }

    getNumberEntries() {

        this.setState({
            bc_values: [],
            temp_values: []
        }); //TODO: DO SOMETHING HERE BECAUSE IF BYTE ARRAYS ARE TO BIG, IT GETS SENT MULTIPLE TIMES, DESTROYING OLD DATA IN THE WEB UI

        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.state.url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Get Json from Response Text
                let json = JSON.parse(xhr.responseText);

                while(json.result.charAt(0) === '0' || json.result.charAt(0) === 'x') {
                    json.result = json.result.substr(1);
                }
                this.getAllEntriesStep(parseInt(json.result, 16))
            }
        };

        let getAllStrings = this.web3.eth.abi.encodeFunctionCall({
            name: 'getLatestDbFunction',
            type: 'function',
            inputs: []
        });

        let data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_call", "params": [{ "to": this.state.contract_address, "data": getAllStrings}, "latest"], "id":1});
        xhr.send(data);
    }

    parseEntriesJsonFromTo(json, from, to) {
        if (from > to) {
            let t = to;
            to = from;
            from = t;
        }

        let _bc_data = [];
        let ic_pos = 0;
        /* Always 128
        for (let i = 0; i < json.result.length; i ++) {
            let res_0 = json.result[i].toString();
            if (json.result[i] === '0' && json.result[i+1] === '4') {
                ic_pos = i + 2;
                console.log('IC ' + (ic_pos - 2) + ": " + json.result[i] + json.result[i+1]);
                break;
            }
        }
        */
        ic_pos = 130;

        let current = "";
        let j = 0;
        let z = 0;

        let temp = {};
        for (let i = ic_pos; i < json.result.length; i ++) {
            if (j === 0) {
                current = "";

                if (z === 0) {
                    temp = {
                        task: null,
                        uuid_dataset: null,
                        editor_name: null,
                        sequence_id: null
                    };
                }
            }

            current = current + json.result[i];
            if (j === 63) {
                if (z === 0) {
                    let _task = this.web3.utils.toAscii('0x' + current);
                    let patt = /(\w+)/i;
                    let _task_beauti = patt.exec(_task);

                    temp.task = _task_beauti[0];
                }
                if (z === 1) {
                    temp.uuid_dataset = current;
                }
                if (z === 2) {
                    temp.editor_name = this.removeTrailingZeros(current);

                }

                if (z === 3) {
                    let base = 16;
                    temp.sequence_id = parseInt(current, base);

                    // push to list
                    _bc_data.push(temp);
                    z = 0;
                }
                else {
                    z ++;
                }
                j = 0;
            }
            else {
                j ++;
            }
        }

        this.setState({
            bc_values: _bc_data
        });
    }

    removeTrailingZeros(toClear) {
        let end = 0;
        for (let i = toClear.length - 1; i >= 0; i --) {
            if (toClear[i] !== '0') {
                end = i;
                break;
            }
        }

        let ret = '';
        for (let i = 0; i <= end; i ++) {
            ret += toClear[i];
        }
        return ret;
    }

    showEntriesGrid() {
        if (this.state.bc_values.length > 0) {
            return <Center>
                <div className='width-60p center mm'>
                    <Table striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Sequence Id</Table.HeaderCell>
                                <Table.HeaderCell>Task</Table.HeaderCell>
                                <Table.HeaderCell>UUID</Table.HeaderCell>
                                <Table.HeaderCell>Editor</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { this.state.bc_values.map((item, i) => {
                                return <Table.Row key={'entries_row' + i}>
                                    <Table.Cell>{ item.sequence_id }</Table.Cell>
                                    <Table.Cell>{ item.task }</Table.Cell>
                                    <Table.Cell>{ item.uuid_dataset }</Table.Cell>
                                    <Table.Cell>{ item.editor_name }</Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>
                </div>
            </Center>
        }
    }

    selectGroup(event, data) {
        this.setState({
            [data.name]: data.value
        })
    }


    getHash(object) {
        // Should be salted!
        let bitArray = sjcl.hash.sha256.hash(JSON.stringify(object));
        return sjcl.codec.hex.fromBits(bitArray);
    }

    render() {
        return (
            <div>
                <div>
                    <Divider horizontal className="mm">Blockchain Init</Divider>
                    <Center>
                        <Input name="url" type="text" value={this.state.url} onChange={this.handleChange} className="mm" placeholder='Url...' />
                        <Input name="contract_address" type="text" value={this.state.contract_address} onChange={this.handleChange} className="mm" placeholder='Contract Address...' />
                        <Input name="user_address" type="text" value={this.state.user_address} onChange={this.handleChange} className="mm" placeholder='User Address...' />
                    </Center>

                    <Center>
                        <div className='width-60p center mm'>
                            <Table definition striped>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>Chain Access-point Url</Table.Cell>
                                        <Table.Cell>{ this.state.url }</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>Contract Address on Chain</Table.Cell>
                                        <Table.Cell>{ this.state.contract_address }</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>User Address</Table.Cell>
                                        <Table.Cell>{ this.state.user_address }</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </div>
                    </Center>
                    <Divider horizontal className="mm">Adding to Blockchain</Divider>
                    <Center>
                        <Button onClick={() => this.unlock()} className="mm">Unlock Account</Button>
                        <Dropdown name="task" placeholder='task option...' onChange={this.selectGroup}
                                  search selection options={this.taskOptions} className="mm" />
                        <Button onClick={() => this.sendDbEntry()} className='mm'>Post</Button>
                    </Center>

                    <Divider horizontal className="mm">Other Blockchain Actions</Divider>
                    <Center>
                        <Button onClick={() => this.getNumberEntries()} className="mm">Get all Entries</Button>
                    </Center>

                    { this.showEntriesGrid() }

                </div>
            </div>
        );
    }
}

export default EthComponent;