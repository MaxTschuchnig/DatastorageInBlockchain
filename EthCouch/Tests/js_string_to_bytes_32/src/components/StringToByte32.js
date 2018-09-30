import React, { Component } from 'react';
import { Input, Card } from 'semantic-ui-react';
import Center from 'react-center';
import Web3 from 'web3';

class StringToByte32 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toConvert: ""
        };


        if (typeof this.web3 !== 'undefined') {
            this.web3 = new Web3(this.web3.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
        }

        window.web3 = this.web3; // Available in web console

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    convertTo(toByteArray) {
        if (toByteArray !== "") {
            let retBytes = this.web3.utils.fromAscii(toByteArray, 32);

            return <b>{retBytes}</b>
        }
        return <b>none</b>
    }

    convertToAndBack(toByteArray) {
        if (toByteArray !== null) {
            let retBytes = this.web3.utils.fromAscii(toByteArray, 32);
            let retString = this.web3.utils.toAscii(retBytes);

            return <b>{retString}</b>
        }
        return <b>none</b>
    }

    render() {
        return (
            <Center>
                <Card>
                    <Card.Content>
                        <Card.Header>String To Byte32</Card.Header>
                    </Card.Content>
                    <Card.Content extra>
                        <Input name="toConvert" placeholder='String to convert...' value={this.state.toConvert} onChange={this.handleChange}/>
                        <div>Convert to: {this.convertTo(this.state.toConvert)}</div>
                        <div>Back Transform: {this.convertToAndBack(this.state.toConvert)}</div>
                    </Card.Content>
                </Card>
            </Center>
        );
    }
}

export default StringToByte32;

