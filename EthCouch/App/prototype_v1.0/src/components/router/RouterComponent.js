import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom'
import MainComponent from '../main/MainComponent'
import IdbComponent from "../idb/IdbComponent";
import EthComponent from "../eth/EthComponent";
import EthercouchComponent from "../ethercouch/EthercouchComponent";

class RouterComponent extends Component {
    render() {
        return (
            <div className="min_heigth_800">
                <Switch>
                    <Route exact path='/' component={MainComponent}/>
                    <Route path='/idb' component={IdbComponent}/>
                    <Route path='/eth' component={EthComponent}/>
                    <Route path='/ethcouch' component={EthercouchComponent} />
                </Switch>
            </div>
        );
    }
}

export default RouterComponent;