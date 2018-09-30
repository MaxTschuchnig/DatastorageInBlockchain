import React, { Component } from 'react';
import Web3 from 'web3'

class PersonenComponent extends Component {
	constructor(props) {
		super(props);
		
		this.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
		window.web3 = this.web3; // Available in web console
		
		this.state = {
			name: ''
		};
		
		this.handleChange_name = this.handleChange_name.bind(this);
		this.handlePost = this.handlePost.bind(this);
	}
	
	ascii_to_hex(str) {
		var arr1 = [];
		for (var n = 0, l = str.length; n < l; n ++) 
		{
			var hex = Number(str.charCodeAt(n)).toString(16);
			arr1.push(hex);
		}
		return arr1.join('');
	}
	
	handleChange_name(event) {
		this.setState({
			name: event.target.value
		});
	}	
	
	/* replaced by web 3
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
		
		var leading = '000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000'
		var hexStringLength = (this.state.name.length + 1).toString(16);
		if (hexStringLength.length > 2) {
			alert('String to long!');
		}
		
		while(hexStringLength.length < 2) {
			hexStringLength = '0' + hexStringLength;
		}
		
		var hexTail = this.ascii_to_hex(',' + this.state.name);
		while(hexTail.length < 64) {
			hexTail = hexTail + '0';
		}
		
		var hex = leading + hexStringLength + hexTail;
		
		while(hex.length < 64)
		{
			hex = '0' + hex;
		}
		console.log('0x' + hex);
		
		var paramsData = "0x7fcaf666" + hex;
		var data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_sendTransaction", "params": [{ "from": "0xc01417230d89004fe2b93d00f9eafe5114f6d210","to": "0x73e0c6eb1b74b0210615aa1c2bca37971480b8ed", "data": paramsData}], "id":1});
		console.log(data);
		xhr.send(data);
	} */
	
	handlePost(event) {
		var xhr = new XMLHttpRequest();
		var url = 'http://127.0.0.1:8545';
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var json = JSON.parse(xhr.responseText);
				console.log(json.result);
			}
		};
		
		var abi_encoded = this.web3.eth.abi.encodeParameter('string', this.state.name + ', ');
		//remove 0x from string
		var datas = abi_encoded.split('x');
		
		var paramsData = "0x7fcaf666" + datas[1];
		var data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_sendTransaction", "params": [{ "from": "0xc01417230d89004fe2b93d00f9eafe5114f6d210","to": "0x73e0c6eb1b74b0210615aa1c2bca37971480b8ed", "data": paramsData}], "id":1});
		console.log(data);
		xhr.send(data);
	}
	
	handleRequest(event) {
		var xhr = new XMLHttpRequest();
		var url = 'http://127.0.0.1:8545';
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4 && xhr.status === 200) {
				var json = JSON.parse(xhr.responseText);
				console.log(this.web3.utils.toAscii(json.result));
			}
		};
		
		var _default = '0';
		while(_default.length < 64)
		{
			_default = '0' + _default;
		}
		
		var paramsData = "0x28460980" + _default;
		var data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_call", "params": [{ "to": "0x73e0c6eb1b74b0210615aa1c2bca37971480b8ed", "data": paramsData}, "latest"], "id":1});
		xhr.send(data);
	}
	
	render() {
		return (
			<div>
				<h4>String Test</h4>

				<div>
					Name
					<input type="text" value={this.state.name} onChange={this.handleChange_name} />
					<button onClick={() => this.handlePost()}>Post</button>
				</div>
				<div>
					All Data:
					<button onClick={() => this.handleRequest()}>Request</button>
				</div>
			</div>
		);
	}
}

export default PersonenComponent;