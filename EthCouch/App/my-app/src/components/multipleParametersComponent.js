import React, { Component } from 'react';
import Web3 from 'web3'

class MultipleParametersComponent extends Component {
    constructor(props) {
        super(props);

        this.url = 'http://127.0.0.1:8545';
        this.web3 = new Web3(new Web3.providers.HttpProvider(this.url));
        window.web3 = this.web3; // Available in web console

        this.contractAddress = '0xadc482bd28ca896f1329b3715d6733b0d9fb883a';
        this.userAddress = '0xc01417230d89004fe2b93d00f9eafe5114f6d210';

        this.state = {
            name: '',
            age: 0
        };

        this.handleChange_name = this.handleChange_name.bind(this);
        this.handleChange_age = this.handleChange_age.bind(this);

        this.sendPerson = this.sendPerson.bind(this);
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

    handleChange_age(event) {
        this.setState({
            age: event.target.value
        })
    }

    sendPerson(event) {
        console.log('Name: ' + this.state.name + ', age: ' + this.state.age);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var json = JSON.parse(xhr.responseText);
                console.log(json.result);
            }
        };

        var data = this.web3.eth.abi.encodeFunctionCall({
            name: 'setPerson',
            type: 'function',
            inputs: [{
                type: 'uint256',
                name: '_age'
            },{
                type: 'string',
                name: '_name'
            }]
        }, [this.state.age, this.state.name]);

        var data = JSON.stringify({"jsonrpc":"2.0", "method":"eth_sendTransaction", "params": [{ "from": this.userAddress,"to": this.contractAddress, "data": data}], "id":1});
        console.log(data);
        xhr.send(data);
    }

    getPerson(event) {

    }

    render() {
        return (
            <div>
                <h4>Multiple Parameters Test</h4>
                <div>
                    Name
                    <input type="text" value={this.state.name} onChange={this.handleChange_name} />
                    Age
                    <input type="number" value={this.state.age} onChange={this.handleChange_age} />
                </div>
                <div>
                    <button onClick={() => this.sendPerson()}>Post</button>
                </div>
            </div>
        );
    }
}

export default MultipleParametersComponent;