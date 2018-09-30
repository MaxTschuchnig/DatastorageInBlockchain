import React, { Component } from 'react';
import Web3 from 'web3';
import { Button, Input, Divider, Table } from 'semantic-ui-react';
import Center from 'react-center';
import './../../App.css'

class EthComponent extends Component {
    constructor(props) {
        super(props);

        this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));
        window.web3 = this.web3; // Available in web console

        this.state = {
            url: "http://localhost:8545",
            contract_address: "0x9406ddb524dcd0a4b32ac2efdd922cb1df0ce8ba",
            user_address: "0x33fc787c786ff5fc555a83d83dc7392730568bdf",
            task: "",
            uuid_dataset: "",
            editor_name: "",
            bc_values: []
        };

        this.handleChange = this.handleChange.bind(this);
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
                console.log('Task: ' + this.state.task + ', UUID: ' + this.state.uuid_dataset + ', Editor' + this.state.editor_name);
                let xhr = new XMLHttpRequest();
                xhr.open("POST", this.state.url, true);
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
                    }]
                }, [this.state.task, this.state.uuid_dataset, this.state.editor_name]);

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

    getEntries() {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.state.url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Get Json from Response Text
                let json = JSON.parse(xhr.responseText);
                this.parseEntriesJson(json);
            }
        };

        let getAllStrings = this.web3.eth.abi.encodeFunctionCall({
            name: 'getDbFunctions',
            type: 'function',
            inputs: []
        });

        let data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_call", "params": [{ "to": this.state.contract_address, "data": getAllStrings}, "latest"], "id":1});
        xhr.send(data);
    }

    parseEntriesJson(json) {
        // convert json to ascii signs
        let json_parsed = this.web3.utils.toAscii(json.result);

        // remove unused ascii signs
        let patt = /(\w+:(\w+;)+)/i;
        let ret_data = patt.exec(json_parsed);

        // Split metadata from data
        let split_number_added = ret_data[0].split(':');

        // Split data items
        let bc_items_info = split_number_added[1].split(';');
        let _bc_data = [];
        for (let i = 0; i < parseInt(split_number_added[0]); i ++) {
            // Create an object for each 4 data items
            let temp = {
                task: bc_items_info[i*4],
                uuid_dataset: bc_items_info[1 + i*4],
                editor_name: bc_items_info[2 + i*4],
                sequence_id: parseInt(bc_items_info[3 + i*4])
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

    render() {
        return (
            <div>
                <div>
                    <Divider horizontal className="mm">Blockchain Init</Divider>
                    <div>
                        <Input name="url" type="text" value={this.state.url} onChange={this.handleChange} className="mm" placeholder='Url...' />
                        <Input name="contract_address" type="text" value={this.state.contract_address} onChange={this.handleChange} className="mm" placeholder='Contract Address...' />
                        <Input name="user_address" type="text" value={this.state.user_address} onChange={this.handleChange} className="mm" placeholder='User Address...' />
                    </div>

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
                    <Button onClick={() => this.unlock()} className="mm">Unlock Account</Button>
                    <Input name="task" type="text" value={this.state.task} onChange={this.handleChange} className="mm" placeholder='Task...' />
                    <Input name="uuid_dataset" type="text" value={this.state.uuid_dataset} onChange={this.handleChange} className="mm" placeholder='Uuid Data...' />
                    <Input name="editor_name" type="text" value={this.state.editor_name} onChange={this.handleChange} className="mm" placeholder='Editor Name...' />
                    <Button onClick={() => this.sendDbEntry()} className='mm'>Post</Button>
                    <Divider horizontal className="mm">Other Blockchain Actions</Divider>
                    <Button onClick={() => this.getEntries()} className="mm">Get Data</Button>

                    { this.showEntriesGrid() }

                </div>
            </div>
        );
    }
}

export default EthComponent;