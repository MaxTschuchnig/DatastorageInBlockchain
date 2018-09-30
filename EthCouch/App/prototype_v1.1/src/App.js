import React, { Component } from 'react';
import './App.css';
import { Sidebar, Segment, Icon, Menu } from 'semantic-ui-react'
import MySidebar from "./mainPageElements/mySidebar";
import RouterContainer from "./mainPageElements/myRouterContainer";


class App extends Component {
    state = { visible: false };

    toggleVisibility = () => this.setState({ visible: !this.state.visible });

    render() {
        const { visible } = this.state;
        return (
            <div>
                <header className="App-header">
                    <div className="App-title">
                        <Icon name="ellipsis vertical" className="left" onClick={this.toggleVisibility}/>
                    </div>
                </header>
                <Sidebar.Pushable as={Segment}>
                    <Sidebar as={Menu} animation='push' width='thin' visible={visible} icon='labeled' vertical inverted>
                        <MySidebar/>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <div className="padding_16">
                            <Segment basic className='min_heigth_800'>
                                <RouterContainer/>
                            </Segment>
                        </div>

                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        );
    }
}

export default App;
