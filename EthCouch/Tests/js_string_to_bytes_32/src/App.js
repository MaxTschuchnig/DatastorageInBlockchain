import React, { Component } from 'react';
import MySidebar from "./mainPage/Sidebar";
import MyRouter from "./mainPage/Router";
import { Sidebar, Segment, Icon, Menu } from 'semantic-ui-react';
import './App.css';

class App extends Component {
    state = { visible: false };
    toggleVisibility = () => this.setState({ visible: !this.state.visible });

    render() {
        return (
            <div>
                <header className="App-header">
                    <div className="App-title">
                        <Icon name="ellipsis vertical" className="left" onClick={this.toggleVisibility}/>
                    </div>
                </header>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar as={Menu} animation='push' width='thin' visible={this.state.visible} icon='labeled' vertical inverted>
                        <MySidebar/>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <div className="padding_16">
                            <Segment basic className='min_heigth_800'>
                                <MyRouter/>
                            </Segment>
                        </div>

                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        );
    }
}

export default App;
