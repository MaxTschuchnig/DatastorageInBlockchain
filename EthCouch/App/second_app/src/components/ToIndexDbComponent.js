import React, { Component } from 'react';

class ToIndexDbComponent extends Component {
    constructor(props) {
        super(props);

        this.create_scheme = this.create_scheme.bind(this);
        this.test_db = this.test_db.bind(this);

        // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

        // Open (or create) the database
        this.open = indexedDB.open("mydb", 1); // Name (mydb) and version (1) of db

        // Create the schema
        this.open.onupgradeneeded = () => {
            var db = this.open.result;
            var store = db.createObjectStore("mystore", {keyPath: "id"});

            // enables searching by first and lastname tupel
            var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
        };

        this.open.onsuccess = () => {
            // Start a new transaction
            var db = this.open.result;
            var tx = db.transaction("mystore", "readwrite");
            var store = tx.objectStore("mystore");
            var index = store.index("NameIndex");

            // Add some data
            store.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
            store.put({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35});

            // Query the data
            var getJohn = store.get(12345);
            var getBob = index.get(["Smith", "Bob"]);

            getJohn.onsuccess = function () {
                console.log(getJohn.result.name.first);  // => "John"
            };

            getBob.onsuccess = function () {
                console.log(getBob.result.name.first);   // => "Bob"
            };

            // Close the db when the transaction is done
            tx.oncomplete = function () {
                db.close();
            };
        };
    };

    create_scheme() {

    }

    test_db() {

    }


    render() {
        return (
            <div>
                <h1> MY FIRST REACT APP </h1>
                <button onClick={() => this.create_scheme()}>create</button>
                <button onClick={() => this.test_db()}>test</button>
            </div>
        );
    }
}

export default ToIndexDbComponent;