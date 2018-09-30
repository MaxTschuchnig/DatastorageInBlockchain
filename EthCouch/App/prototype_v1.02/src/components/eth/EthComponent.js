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
            bc_values: []
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

    ascii_to_hex(str) {
        let arr1 = [];
        for (let n = 0, l = str.length; n < l; n ++)
        {
            let hex = Number(str.charCodeAt(n)).toString(16);
            arr1.push(hex);
        }
        return arr1.join('');
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
                        type: 'string',
                        name: '_task'
                    }, {
                        type: 'string',
                        name: '_uuid_dataset'
                    }, {
                        type: 'string',
                        name: '_editor_name'
                    }]
                }, [this.state.task, this.getHash(obj), this.state.user_address]);

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

        // convert json to ascii signs
        let json_parsed = this.web3.utils.toAscii(json.result);

        // remove unused ascii signs
        let patt = /(\d+:(\w+;)+)/i;
        let ret_data = patt.exec(json_parsed);

        // Split metadata from data
        let split_number_added = ret_data[0].split(':');

        // Split data items
        let bc_items_info = split_number_added[1].split(';');
        let _bc_data = this.state.bc_values;
        for (let i = 0; i < to - from; i ++) {
            // Create an object for each 4 data items
            let temp = {
                task: bc_items_info[i*4],
                uuid_dataset: bc_items_info[1 + i*4],
                editor_name: bc_items_info[2 + i*4],
                sequence_id: parseInt(bc_items_info[3 + i*4], 10)
            };
            // push to list
            _bc_data.push(temp);
        }
        this.setState({
            bc_values: _bc_data
        });
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