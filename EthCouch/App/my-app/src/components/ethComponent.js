import React, { Component } from 'react';

class Ethcomponent extends Component {
	constructor(props) {
		super(props);
		this.state = {value: ''};

		this.handleChange = this.handleChange.bind(this);
		this.handlePost = this.handlePost.bind(this);
	}
	
	handleChange(event) {
		this.setState({value: event.target.value});
	}	
	
	handlePost(event) {
		var xhr = new XMLHttpRequest();
		var url = 'http://127.0.0.1:8545';
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var json = JSON.parse(xhr.responseText);
				console.log("result: " + parseInt(json.result, 16));
			}
		};
		
		var number = parseInt(this.state.value, 10)
		var hexNumber = number.toString(16);
		
		while(hexNumber.length < 64)
		{
			hexNumber = '0' + hexNumber;
		}
		var paramsData = "0x55241077" + hexNumber;
		
		var data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_call", "params": [{ "to": "0x98b299b3092f576aba851583728c02774fba7bfa", "data": paramsData}, "latest"], "id":1});
		xhr.send(data);
	}
	
	render() {
		return (
			<div>
				<h4>First Contract Test</h4>
				<div>
					Square
					<input type="number" value={this.state.value} onChange={this.handleChange} />
				</div>
				<button onClick={this.handlePost}>Post</button>
			</div>
		);
	}
}

export default Ethcomponent;
