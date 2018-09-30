import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom'
import { Segment, Menu, Icon, Sidebar , Grid } from 'semantic-ui-react';
import RouterContainer from "./components/router/RouterComponent";

class App extends Component {
    constructor(props) {
        super(props);

        this.id = 0;

        this.add_user = this.add_user.bind(this);

        // This works on all devices/browsers, and uses IndexedDBShim as a final fallback
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

        // Open (or create) the database
        this.open = indexedDB.open("mydb", 1); // Name (mydb) and version (1) of db

        // Create the schema
        this.open.onupgradeneeded = () => {
            this.db = this.open.result;
            this.store = this.db.createObjectStore("mystore", {keyPath: "id"});
        };

        this.open.onsuccess = () => {
            this.db_connection = true;
        };
    };

    add_user(firstname, lastname, age) {
        this.open = this.indexedDB.open("mydb", 1);
        this._firstname = firstname;
        this._lastname = lastname;
        this._age = age;

        this.open.onsuccess = () => {
            this.db = this.open.result;
            var transaction = this.db.transaction(["mystore"], "readwrite");
            console.log(transaction);

            // Do something when all the data is added to the database.
            transaction.oncomplete = function(event) {
                console.log("All done!");
            };

            transaction.onerror = function(event) {
                console.log("Error!");
            };

            console.log(this._firstname + this._lastname + this._age);

            const user = {"id":this.id, "firstname":firstname, "lastname":lastname, "age":age};
            console.log(user);
            let objectStore = transaction.objectStore("mystore");
            let request = objectStore.add(user);
            request.onsuccess = function(event) {
                console.log("success");
            };

            this.id += 1;
        };
    }

    state = { visible: false };

    toggleVisibility = () => {
        this.setState({ visible: !this.state.visible });
    };

    render() {
        const { visible } = this.state;
        return (
            <div className="App">
                <header className="App-header">
                    <div className="App-title">
                        <Grid columns={3}>
                            <Grid.Column key="0" className="left">
                                <Icon name="ellipsis vertical" className="middle_vert on_hover_pointer" onClick={this.toggleVisibility}/>
                            </Grid.Column>
                            <Grid.Column key="1">
                                <h1 className="middle_vert">Datastorage Blockchain - Evaluating Distributed Ledgers</h1>
                            </Grid.Column>
                            <Grid.Column key="2">
                                <p className="middle_vert right">FH-Salzburg</p>
                            </Grid.Column>
                        </Grid>
                    </div>
                </header>

                <div className="App">
                    <Sidebar.Pushable as={Segment} attached="bottom">
                        <Sidebar width='thin' as={Menu} animation="uncover" visible={visible} icon="labeled" vertical inline inverted>
                            <nav>
                                <Link to='/'>
                                    <Menu.Item><Icon name="home" />home</Menu.Item>
                                </Link>
                                <Link to='/idb'>
                                    <Menu.Item><Icon name="folder"/>idb</Menu.Item>
                                </Link>
                                <Link to='/eth'>
                                    <Menu.Item><Icon name="chain"/>eth</Menu.Item>
                                </Link>
                                <Link to='/ethcouch'>
                                    <Menu.Item><Icon name="retweet"/>ethcouch</Menu.Item>
                                </Link>
                            </nav>
                        </Sidebar>
                        <Sidebar.Pusher dimmed={this.state.visible}>
                            <div className="padding_16">
                                <Segment basic>

                                    <RouterContainer/>
                                </Segment>
                            </div>
                        </Sidebar.Pusher>
                    </Sidebar.Pushable>
                </div>
            </div>
        );
    }
}

export default App;
