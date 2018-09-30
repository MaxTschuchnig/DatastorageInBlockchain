import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Testcomponent from './components/testcomponent.js';
import Ethcomponent from './components/ethComponent.js';
import PersonenComponent from './components/personenComponent.js';
import MultipleParametersComponent from "./components/multipleParametersComponent";

class App extends Component {
	render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h1 className="App-title">Welcome to React</h1>
				</header>
				<p className="App-intro">
					To get started, edit <code>src/App.js</code> and save to reload.
				</p>
				<Testcomponent />
				<Ethcomponent />
				<PersonenComponent />
				<MultipleParametersComponent />
			</div>
		);
	}
}

export default App;
