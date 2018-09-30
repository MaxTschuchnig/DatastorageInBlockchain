import React, { Component } from 'react';
import { Button, Input, Divider, List } from 'semantic-ui-react';
import Center from 'react-center';
import './../../App.css';

class IdbComponent extends Component {
    constructor(props) {
        super(props);

        this.id = 0;
        this.state = {
            firstname: "",
            lastname: "",
            age: 0,
            data: []
        };

        this.create_db = this.create_db.bind(this);
        this.add_user = this.add_user.bind(this);
        this.delete_db = this.delete_db.bind(this);
        this.get_all = this.get_all.bind(this);

        this.handleFirstnameChange = this.handleFirstnameChange.bind(this);
        this.handleLastnameChange = this.handleLastnameChange.bind(this);
        this.handleAgeChange = this.handleAgeChange.bind(this);
    };

    create_db(ref) {
        console.log("Creating Database: mydb");
        ref.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

        // Open (or create) the database
        ref.open = indexedDB.open("mydb", 1); // Name (mydb) and version (1) of db

        // Create the schema
        ref.open.onupgradeneeded = () => {
            console.log("in onupgradeneeded");
            ref.db = ref.open.result;
            this.store = ref.db.createObjectStore("mystore", {keyPath: "id"});

            console.log("created object store: mystore");
        };

        ref.open.onsuccess = () => {
            ref.db = ref.open.result;
            ref.db_connection = true;

            console.log("opening db successful");
        };
    }

    add_user(ref, firstname, lastname, age) {
        this._firstname = firstname;
        this._lastname = lastname;
        this._age = age;

        var transaction = ref.db.transaction(["mystore"], "readwrite");

        // Do something when all the data is added to the database.
        transaction.oncomplete = event => {
            console.log("Data added: " + this._firstname + ", " + this._lastname + ": " + this._age);
        };

        transaction.onerror = event => {
            console.log("Error adding " + this._firstname + ", " + this._lastname + ": " + this._age);
            console.log(event);
        };

        const user = {"id":ref.id, "firstname":this._firstname, "lastname":this._lastname, "age":this._age};
        var objectStore = transaction.objectStore("mystore");
        var request = objectStore.add(user);
        request.onsuccess = function(event) {
            console.log("success");
        };

        ref.id += 1;
    }

    delete_db(ref, db_name) {
        console.log("Deleting db: " + db_name +  " - Deletion will be performed once all adapters are closed - Reload Page!.");

        var DBDeleteRequest = window.indexedDB.deleteDatabase(db_name);

        DBDeleteRequest.onerror = function(event) {
            console.log("Error deleting database.");
        };

        DBDeleteRequest.onsuccess = event => {
            console.log("Database deleted successfully.");
        };
    }

    get_all(ref) {
        var transaction = ref.db.transaction(["mystore"], "readwrite");

        var objectStore = transaction.objectStore("mystore");

        objectStore.getAll().onsuccess = event => {
            var res = event.explicitOriginalTarget.result;

            if (res.length === 0) {
                console.log("Database empty...");
            }

            this.setState({data:[]});
            res.forEach(_data => {
                var temp = this.state.data;
                temp.push("Id: " + _data.id + " - " + _data.firstname + " " + _data.lastname + ": " + _data.age);
                this.setState({data: temp});
            })
        };
    }

    handleFirstnameChange(event) {
        this.setState({firstname: event.target.value});
    }

    handleLastnameChange(event) {
        this.setState({lastname: event.target.value});
    }

    handleAgeChange(event) {
        this.setState({age: event.target.value});
    }

    render() {
        return (
            <div>
                <Divider horizontal className="mm">Database create/delete</Divider>
                <Center>
                    <Button className="mm" onClick={() => { this.create_db(this); }}>create db</Button>
                    <Button className="mm" onClick={() => { this.delete_db(this, "mydb"); }}>delete db</Button>
                </Center>

                <Divider horizontal className="mm">Adding Data</Divider>
                <Center>
                    <Input value={this.state.firstname} onChange={this.handleFirstnameChange} placeholder='Firstname...' type='text' className="mm" />
                    <Input value={this.state.lastname} onChange={this.handleLastnameChange} placeholder='Lastname...' type='text' className="mm" />
                    <Input value={this.state.age} onChange={this.handleAgeChange} placeholder='Age...' type='number' className="mm" />
                    <Button className="mm" onClick={() => { this.add_user(this, this.state.firstname, this.state.lastname, this.state.age); }}>add user</Button>
                </Center>

                <Divider horizontal className="mm">Print Data</Divider>
                <Center>
                    <Button className="mm" onClick={() => { this.get_all(this); }}>get data</Button>
                    <List items={this.state.data} />
                </Center>
            </div>
        );
    }
}

export default IdbComponent;