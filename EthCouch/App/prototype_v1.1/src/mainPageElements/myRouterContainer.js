import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import MainComponent from "../components/main/MainComponent";
import IdbComponent from "../components/idb/IdbComponent";
import EthComponent from "../components/eth/EthComponent";
import EthcouchComponent from "../components/ethcouch/EthcouchComponent";
import StressTest from "../components/StressTest/StressTest";

class RouterContainer extends Component {

    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={MainComponent}/>
                    <Route path='/idb' component={IdbComponent}/>
                    <Route path='/eth' component={EthComponent}/>
                    <Route path='/ethcouch' component={EthcouchComponent} />
                    <Route path='/stress' component={StressTest} />
                </Switch>
            </div>
        );
    }
}

export default RouterContainer;