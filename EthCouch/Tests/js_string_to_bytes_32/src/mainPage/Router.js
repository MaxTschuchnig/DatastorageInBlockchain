import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import MainComponent from "../components/MainComponent";
import StringToByte32 from "../components/StringToByte32";

class RouterContainer extends Component {

    render() {
        return (
            <div>
                <Switch>
                    <Route exact path='/' component={MainComponent}/>
                    <Route path='/stb32' component={StringToByte32}/>
                </Switch>
            </div>
        );
    }
}

export default RouterContainer;