import React, { Component } from 'react';
import Web3 from 'web3';
import { Divider, Dropdown, Button, Input } from 'semantic-ui-react';
import Center from 'react-center';
import './../../../App.css';

class EditComponent extends Component {
    constructor(props) {
        super(props);

        this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));
        window.web3 = this.web3; // Available in web console

        this.state = {
            parent: props.parent,
            ticket: null,
            rev_id: "",
            rev: null
        };

        this.handleTicketDataTechnician = this.handleTicketDataTechnician.bind(this);
        this.handleTicketDataTask = this.handleTicketDataTask.bind(this);
        this.handleTicketDataDueDate = this.handleTicketDataDueDate.bind(this);
        this.selectGroup = this.selectGroup.bind(this);
    }

    handleTicketDataTechnician(event) {
        let temp = this.state.ticket;
        temp.data.technician = event.target.value;
        this.setState({ticket: temp});
    }

    handleTicketDataTask(event) {
        let temp = this.state.ticket;
        temp.data.task = event.target.value;
        this.setState({ticket: temp});
    }

    handleTicketDataDueDate(event) {
        let temp = this.state.ticket;
        temp.data.due_date = event.target.value;
        this.setState({ticket: temp});
    }

    selectGroup(event, data) {
        let dataObj = JSON.parse(data.value);

        let tempO = Object.assign({}, dataObj);
        tempO.data = {};
        let tempD = Object.assign({}, dataObj.data);
        tempO.data = tempD;

        this.setState({
            ticket: dataObj,
            rev_id: dataObj._id,
            rev: tempO
        });
    }

    renderInputs() {
        if (this.state.ticket !== null) {
            return <Center>
                <Input type="text" value={this.state.ticket.data.task} onChange={this.handleTicketDataTask}
                       className="mm" placeholder='task...' />
                <Input type="text" value={this.state.ticket.data.technician} onChange={this.handleTicketDataTechnician}
                       className="mm" placeholder='technician...' />
                <Input type="text" value={this.state.ticket.data.due_date} onChange={this.handleTicketDataDueDate}
                       className="mm" placeholder='due date...' />
            </Center>
        }
    }

    doAll() {
        this.addRev();
        this.incrementTicketId();
        this.getSequenceNbr();
        this.deleteEntry(this.state.rev_id);
    }

    addRev() {
        let transaction = this.state.parent.db.transaction(["revs"], "readwrite");

        console.log("Adding rev");
        console.log(this.state.ticket);
        console.log(this.state.rev);

        // Do something when all the data is added to the database.
        transaction.oncomplete = event => {
            console.log("Data added: " + JSON.stringify(this.state.rev));
        };

        transaction.onerror = event => {
            console.log("Error adding " + JSON.stringify(this.state.rev));
            console.log(event);
        };

        let objectStore = transaction.objectStore("revs");
        let request = objectStore.add(this.state.rev);
        request.onsuccess = function(event) {
            console.log("success");
        };
    }

    incrementTicketId() {
        let revId = parseInt(this.state.ticket._id.charAt(0), 10) + 1;
        let tempTicket = this.state.ticket;
        let newId = tempTicket._id;
        tempTicket._id = revId + newId.substring(1);
        this.setState({
            ticket: tempTicket
        });
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

                let tempTicket = this.state.ticket;
                tempTicket._seq = parseInt(json.result, 16);
                tempTicket._task = "edit";
                this.setState({
                    ticket: tempTicket
                });

                this.add_item_idb(this.state.parent);
                this.add_item_bc();
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

    add_item_idb(ref) {
        let transaction = ref.db.transaction(["data"], "readwrite");

        // Do something when all the data is added to the database.
        transaction.oncomplete = event => {
            console.log("Data added: " + JSON.stringify(this.state.ticket));
        };

        transaction.onerror = event => {
            console.log("Error adding " + JSON.stringify(this.state.ticket));
            console.log(event);
        };

        let objectStore = transaction.objectStore("data");
        let request = objectStore.add(this.state.ticket);
        request.onsuccess = function(event) {
            console.log("success");
        };
    }

    add_item_bc() {
        let item = {
            _id: this.state.ticket._id,
            _seq: this.state.ticket._seq,
            _editor: this.state.parent.state.user_address,
            _task: this.state.ticket._task
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

    deleteEntry(id){
        let transaction = this.state.parent.db.transaction(["data"], "readwrite");
        let objectStore = transaction.objectStore("data");
        let objectStoreRequest = objectStore.delete(id);

        console.log(id);
        objectStoreRequest.onsuccess = function(event) {
            console.log(event);
        };
    }

    render() {
        return (
            <div>
                <Divider horizontal className="mm">Editing</Divider>
                <Center>
                    <Dropdown name="ticket" placeholder='tickets...' onChange={this.selectGroup} search selection
                              options={this.state.parent.state.values_dropdown} className="mm" />
                    <Button onClick={() => this.doAll()} className='mm'>Submit Changes</Button>
                </Center>
                { this.renderInputs() }
            </div>
        );
    }
}

export default EditComponent;