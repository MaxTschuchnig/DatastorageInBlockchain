import React, { Component } from 'react';
import { Divider, Dropdown, Button } from 'semantic-ui-react';
import Center from 'react-center';
import './../../../App.css';

class DeleteComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parent: props.parent,
            url: props.url,
            contract_address: props.contract_address,
            user_address: props.user_address
        }
    }

    /*
    tickets = [
        { key: 1, text: 'Demo-1', value: 'Demo-1' },
        { key: 2, text: 'Demo-2', value: 'Demo-2' },
        { key: 3, text: 'Demo-3', value: 'Demo-3' },
    ];
    */

    // If delete, check bc if existing
    // If is recursively delete all ids and revs (start with latest to oldest)
    // If all deleted, add Deleted to bc

    render() {
        return (
            <div>
                <Divider horizontal className="mm">Deleting</Divider>
                <Center>
                    <Dropdown placeholder='tickets...' search selection options={this.tickets} className="mm" />
                    <Button onClick={() => console.log('Deleting Data')} className='mm'>Submit</Button>
                </Center>
            </div>
        );
    }
}

export default DeleteComponent;