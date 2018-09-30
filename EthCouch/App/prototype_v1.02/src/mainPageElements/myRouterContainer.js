import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import MainComponent from "../components/main/MainComponent";
import IdbComponent from "../components/idb/IdbComponent";
import EthComponent from "../components/eth/EthComponent";
import EthcouchComponent from "../components/ethcouch/EthcouchComponent";

class RouterContainer extends Component {

    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={MainComponent}/>
                    <Route path='/idb' component={IdbComponent}/>
                    <Route path='/eth' component={EthComponent}/>
                    <Route path='/ethcouch' component={EthcouchComponent} />
                </Switch>
            </div>
        );
    }
}

export default RouterContainer;