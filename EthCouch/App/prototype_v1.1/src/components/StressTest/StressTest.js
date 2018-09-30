import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';
import sjcl from "sjcl";
import Web3 from 'web3';
import StressTestCouch from "./StressTestCouch";
import StressTestNoSQL from "./StressTestNoSQL";
import StressTestSQL from "./StressTestSQL";
import StressTestCouchOnly from "./StressTestCouchOnly";

class StressTest extends Component {
    constructor(props) {
        super(props);

        this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));
        window.web3 = this.web3; // Available in web console

        this.state = {
            time: 0,
            counting: false,

            amount: 10000,
            batchSize: 10,

            from: 0,
            to: 100
        };

        this.seq = 0;

        this.editor = '0x7e213faa93aa4f8a614df66d435cc719e112bf15';
        this.url = 'http://localhost:8545';
        this.contract = '0x692a70d2e424a56d2c6c27aa97d1a86395877b3a';

        this.unlocked = false;

        this.create_db = this.create_db.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.create_db(this);
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

    randomDataEntry(seqBefore) {
        // console.log(seqBefore);
        let possibleTask = ['Other', 'Add', 'Edit', 'Delete'];
        let possibleDataTasks = ['Go To Mars', 'Fix Light in Room 434', 'Change Monitor', 'Eat', 'Sleep', 'Exchange Motherboard on 2342c3', 'Find Luke Skywalker', 'Invent FTL', 'Screw Screws on TV', 'Give new Mouse to Steve', 'Enslave Humanity', 'Give useless Advise'];
        let possibleTechnicians = ['Petra', 'Marco', 'Anna', 'Max', 'Susanne', 'Verena', 'Ernst', 'Hermann', 'Thomas', 'Peter', 'Harald', 'Judit', 'Eduard', 'Dejan', 'Sarah', 'Sebastian', 'Steve', 'HAL 9000', 'Hank', 'Dr. Pepper', 'Captain Obvious'];
        let possibleDueDates = ['Today', 'Tomorrow Morning', 'Tomorrow', 'Tomorrow Evening', '2018-12-31', '2020-01-01', '2019-05-05', '2026-07-30', '2050-04-15', 'The Day After Tomorrow', 'Next Summer', '2018-10-05', '2022-11-17', '0000-12-24'];

        let task = possibleTask[Math.floor(Math.random()*possibleTask.length)];
        let dataTask = possibleDataTasks[Math.floor(Math.random()*possibleDataTasks.length)];
        let technician = possibleTechnicians[Math.floor(Math.random()*possibleTechnicians.length)];
        let due = possibleDueDates[Math.floor(Math.random()*possibleDueDates.length)];
        let seq = seqBefore;

        let ticket = {
            task: dataTask,
            technician: technician,
            due_date: due
        };

        let item = {
            _seq: seq,
            _editor: this.editor,
            _task: task,
            data: ticket
        };

        let id = this.getHash(item);
        this.seq = seqBefore + 10;

        item._id = id;
        return item;
    }

    getDataEntries(amount) {
        this.startTimer();

        // Generate Items
        let items = [];
        for (let i = 0; i < amount; i ++) {
            let item = this.randomDataEntry(this.seq);

            items.push(item);
        }

        for (let i = 0; i < amount; i += this.state.batchSize) {
            if (i+this.state.batchSize < amount) {
                this.addItemIDB(this, items.slice(i, i+this.state.batchSize));
                this.addItemsBcBulk(items.slice(i, i+this.state.batchSize));
                this.seq++;
            }
            else {
                let it = items.slice(i, amount);
                this.addItemIDB(this, it);
                this.addItemsBcBulk(it);
            }
        }

        console.log('Done');
    }

    addItemIDB(ref, items) {
        items.forEach(item => {
            let transaction = ref.db.transaction(["data"], "readwrite");

            transaction.onerror = event => {
                console.log("Error adding " + JSON.stringify(item));
                console.log(event);
            };

            let objectStore = transaction.objectStore("data");
            objectStore.add(item);
        });
    }

    getIDBItems(ref) {
        let transaction = ref.db.transaction(["data"], "readwrite");
        let objectStore = transaction.objectStore("data");

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor) {
                console.log(cursor.value);

                cursor.continue();
            } else {
                console.log('Entries all displayed.');
            }
        };
    }

    addItemsBcBulk(items) {

        if (this.unlocked) {
            // add
            this.sendData(items);
        }
        else {
            // unlock and then add
            this.unlockAndAddBulk(items);

            this.unlocked = true;
            let delay = 45000000; // As we unlock for 30 seconds TODO: CHANGED
            setTimeout(() => this.noLongerUnlocked(), delay);
        }
    }

    noLongerUnlocked() {
        console.log('No longer unlocked');
        this.unlocked = false;
    }

    unlockAndAddBulk(items) {
        console.log('In Add Bulk');

        this.web3.extend({
            property: 'myAdmin',
            methods: [{
                name: 'unlock',
                call: 'personal_unlockAccount',
                params: 3,
            }]
        });

        this.web3.myAdmin.unlock(this.editor, 'maxi', 50000) // TODO: CHANGED
            .then(result => {
                console.log('unlocked account... proceeding with task');

                this.sendData(items);
            });
    }

    sendData(items) {
        // console.log('Sending Data to BC: ' + JSON.stringify(items));

        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let json = JSON.parse(xhr.responseText);
                console.log('Data Sent: ' + JSON.stringify(json));
            }
        };

        let _tasks = [];
        let _uuids = [];
        let _editors = [];
        let _seqences = [];

        items.forEach(item => {
            let tempId = '0x' + item._id;
            _uuids.push(tempId);

            let tempSeq = item._seq;
            _seqences.push(tempSeq);

            let tempTask = this.convertTo(item._task);
            _tasks.push(tempTask);

            let tempEditor = item._editor;
            _editors.push(tempEditor);
        });

        let data = this.web3.eth.abi.encodeFunctionCall({
            name: 'batchSetDbFunctionsSeq',
            type: 'function',
            inputs: [{
                type: 'bytes32[]',
                name: '_task'
            }, {
                type: 'bytes32[]',
                name: '_uuid_dataset'
            }, {
                type: 'bytes32[]',
                name: '_editor_name'
            }, {
                type: 'uint256[]',
                name: 'seq'
            }]
        }, [_tasks, _uuids, _editors, _seqences]);

        data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_sendTransaction", "params": [{ "from": this.editor,"to": this.contract, "gas":"0xF4240", "data": data}], "id":1});
        xhr.send(data);
    }

    startTimer() {
        this.setState({
            time: 0,
            counting: true
        });

        setInterval(() => {
            if (this.state.counting === true) {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", this.url, true);
                xhr.setRequestHeader("Content-type", "application/json");
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        // Get Json from Response Text
                        let json = JSON.parse(xhr.responseText);
                        if (parseInt(json.result)/10 >= this.state.amount - 1) {
                            this.stopTimer();
                        }
                    }
                };

                let getAllStrings = this.web3.eth.abi.encodeFunctionCall({
                    name: 'getLatestDbFunction',
                    type: 'function',
                    inputs: []
                }, []);

                let data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_call", "params": [{ "to": this.contract, "data": getAllStrings}, "latest"], "id":1});
                xhr.send(data);

                this.setState({
                    time: this.state.time + 500
                });
            }
        }, 500);
    }

    stopTimer() {
        this.setState({
            counting: false
        });
    }

    getEntriesFromToNoDelete(from, to) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.url, true);
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

        let data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_call", "params": [{ "to": this.contract, "data": getAllStrings}, "latest"], "id":1});
        xhr.send(data);
    }

    getLatestDbNumber() {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", this.url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Get Json from Response Text
                let json = JSON.parse(xhr.responseText);
                console.log(parseInt(json.result));
            }
        };

        let getAllStrings = this.web3.eth.abi.encodeFunctionCall({
            name: 'getLatestDbFunction',
            type: 'function',
            inputs: []
        }, []);

        let data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_call", "params": [{ "to": this.contract, "data": getAllStrings}, "latest"], "id":1});
        xhr.send(data);
    }

    parseEntriesJsonFromTo(json, from, to) {
        if (from > to) {
            let t = to;
            to = from;
            from = t;
        }

        let _bc_data = [];
        let ic_pos = 130;

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

        console.log(_bc_data);
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

    getHash(object) {
        // Should be salted!
        let bitArray = sjcl.hash.sha256.hash(JSON.stringify(object));
        return sjcl.codec.hex.fromBits(bitArray);
    }

    convertTo(toByteArray) {
        return this.web3.utils.fromAscii(toByteArray, 32);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        return (
            <div>
                Stress Test
                <Input name="amount" type="number" value={this.state.amount} onChange={this.handleChange}
                       placeholder='amount' />
                <Input name='from' type='number' value={this.state.from} onChange={this.handleChange}
                       placeholder='get from'/>
                <Input name='to' type='number' value={this.state.to} onChange={this.handleChange}
                       placeholder='get to'/>

                <Button onClick={() => this.getDataEntries(this.state.amount)}>Start Stress-Test</Button>
                <Button onClick={() => this.getEntriesFromToNoDelete(this.state.from,this.state.to)}>Get Data</Button>
                <Button onClick={() => this.getLatestDbNumber()}>Get Latest Db Number</Button>
                {this.state.time}
                <Button onClick={() => this.getIDBItems(this)}>IDB</Button>

                <StressTestSQL parent={this}/>
                <StressTestNoSQL parent={this}/>
                <StressTestCouch parent={this}/>
                <StressTestCouchOnly parent={this}/>
            </div>
        );
    }
}

export default StressTest;