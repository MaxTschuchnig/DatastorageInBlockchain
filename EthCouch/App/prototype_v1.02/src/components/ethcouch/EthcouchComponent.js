import React, { Component } from 'react';
import { Input, Table, Divider } from 'semantic-ui-react';
import Web3 from 'web3';
import Center from 'react-center';
import AddComponent from "./add/AddComponent";
import EditComponent from "./edit/EditComponent";
import DeleteComponent from "./delete/DeleteComponent";
import ViewComponent from "./view/ViewComponent";

class EthcouchComponent extends Component {
    constructor(props) {
        super(props);

        this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));
        window.web3 = this.web3; // Available in web console

        this.state = {
            url: "http://localhost:8545",
            contract_address: "0xb128288ec3497ff5b538d0fb8e090e49f4440891",
            user_address: "0x91162a80b0e0d14931eb2d62144768479bdf4d62",
            values: [],
            values_dropdown: [],
            revs: [],

            bc_entries: 0,
            bc_values: []
        };

        this.create_db = this.create_db.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.create_db(this);

        let delay = 2500;
        setInterval(() => this.getAllData(this), delay);
    }

    create_db(ref) {
        console.log("Creating Database: mydb");
        ref.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

        // Open (or create) the database
        ref.open = indexedDB.open("mydb", 1); // Name (mydb) and version (1) of db

        // Create the schema
        ref.open.onupgradeneeded = () => {
            console.log("in onupgradeneeded");
            ref.db = ref.open.result;
            ref.db.createObjectStore("data", {keyPath: "_id"});
            console.log("created object store: data");

            ref.db.createObjectStore("revs", {keyPath: "_id"});
            console.log("created object store: revs");
        };

        ref.open.onsuccess = () => {
            ref.db = ref.open.result;
            ref.db_connection = true;

            console.log("opening db successful");
        };
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    getAllData(ref) {
        this.loadData(ref);
        this.loadRevs(ref);
        this.getNumberEntries();
    }

    loadData(ref) {
        let transaction = ref.db.transaction(["data"], "readwrite");

        let objectStore = transaction.objectStore("data");

        objectStore.getAll().onsuccess = event => {
            let res = event.explicitOriginalTarget.result;

            if (res.length === 0) {
                console.log("Data database empty...");
            }

            this.setState({values:[]});

            let temp_dropdown = [];
            res.forEach((_data,i) => {
                let temp = this.state.values;
                temp.push(_data);
                this.setState({values: temp});

                let dropdown_item = {
                    key: i,
                    text: _data._id,
                    value: JSON.stringify(_data)
                };
                temp_dropdown.push(dropdown_item);
            });

            if (temp_dropdown !== this.state.values_dropdown) {
                this.setState({values_dropdown:[]});
                this.setState({values_dropdown: temp_dropdown});
            }
        };
    }

    loadRevs(ref) {
        let transaction = ref.db.transaction(["revs"], "readwrite");

        let objectStore = transaction.objectStore("revs");

        objectStore.getAll().onsuccess = event => {
            let res = event.explicitOriginalTarget.result;

            if (res.length === 0) {
                console.log("Revs database empty...");
            }

            this.setState({revs:[]});
            res.forEach(_data => {
                let temp = this.state.revs;
                temp.push(_data);
                this.setState({revs: temp});
            })
        };
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
                if (this.state.bc_entries < parseInt(json.result, 16)) {
                    this.setState({
                        bc_entries: parseInt(json.result, 16)
                    })
                    this.getAllEntriesStep(this.state.bc_entries);
                }
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

    parseEntriesJsonFromTo(json, from, to) {
        if (from > to) {
            let t = to;
            to = from;
            from = t;
        }

        // convert json to ascii signs
        let json_parsed = this.web3.utils.toAscii(json.result);

        // remove unused ascii signs
        let patt = /(\d+:(.*)\d-[\w|\d]+)/i;
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

    render() {
        return (
            <div>
                <Divider horizontal className="mm">Blockchain Connector</Divider>
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

                <AddComponent parent={this}/>
                <EditComponent parent={this}/>
                <ViewComponent parent={this}/>
            </div>
        );
    }
}

export default EthcouchComponent;

/*


                <DeleteComponent parent={this}/>
 */