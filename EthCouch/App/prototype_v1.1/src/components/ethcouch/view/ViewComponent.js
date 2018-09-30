import React, { Component } from 'react';
import { Divider, Table } from 'semantic-ui-react';
import Center from 'react-center';
import './../../../App.css';

class ViewComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            parent: props.parent
        };
    }

    showEntriesGrid() {
        if (this.state.parent.state.values.length > 0) { // exchange >= with >
            return <Center>
                <div className='width-90p center mm'>
                    <Table striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Sequence Id</Table.HeaderCell>
                                <Table.HeaderCell>UUID</Table.HeaderCell>
                                <Table.HeaderCell>Editor</Table.HeaderCell>
                                <Table.HeaderCell>Task</Table.HeaderCell>
                                <Table.HeaderCell>Ticket Task</Table.HeaderCell>
                                <Table.HeaderCell>Technician</Table.HeaderCell>
                                <Table.HeaderCell>Due Date</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { this.state.parent.state.values.map((item, i) => {
                                return <Table.Row key={'EntriesRow' + i}>
                                    <Table.Cell>{item._seq}</Table.Cell>
                                    <Table.Cell>{item._id}</Table.Cell>
                                    <Table.Cell>{item._editor}</Table.Cell>
                                    <Table.Cell>{item._task}</Table.Cell>
                                    <Table.Cell>{item.data.task}</Table.Cell>
                                    <Table.Cell>{item.data.technician}</Table.Cell>
                                    <Table.Cell>{item.data.due_date}</Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>
                </div>
            </Center>
        }
    }

    showRevisionsGrid() {
        if (this.state.parent.state.revs.length > 0) { // exchange >= with >
            return <Center>
                <div className='width-90p center mm'>
                    <Table striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Sequence Id</Table.HeaderCell>
                                <Table.HeaderCell>UUID</Table.HeaderCell>
                                <Table.HeaderCell>Editor</Table.HeaderCell>
                                <Table.HeaderCell>Task</Table.HeaderCell>
                                <Table.HeaderCell>Ticket Task</Table.HeaderCell>
                                <Table.HeaderCell>Technician</Table.HeaderCell>
                                <Table.HeaderCell>Due Date</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { this.state.parent.state.revs.map((item, i) => {
                                return <Table.Row key={'RevisionsRow' + i}>
                                    <Table.Cell>{item._seq}</Table.Cell>
                                    <Table.Cell>{item._id}</Table.Cell>
                                    <Table.Cell>{item._editor}</Table.Cell>
                                    <Table.Cell>{item._task}</Table.Cell>
                                    <Table.Cell>{item.data.task}</Table.Cell>
                                    <Table.Cell>{item.data.technician}</Table.Cell>
                                    <Table.Cell>{item.data.due_date}</Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>
                </div>
            </Center>
        }
    }

    showBcValuesGrid() {
        if (this.state.parent.state.bc_values.length > 0) {
            return <Center>
                <div className='width-60p center mm'>
                    <Table striped>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Sequence Id</Table.HeaderCell>
                                <Table.HeaderCell>Task</Table.HeaderCell>
                                <Table.HeaderCell>UUID</Table.HeaderCell>
                                <Table.HeaderCell>Editor</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            { this.state.parent.state.bc_values.map((item, i) => {
                                return <Table.Row key={'BcValuesRow' + i}>
                                    <Table.Cell>{ item.sequence_id }</Table.Cell>
                                    <Table.Cell>{ item.task }</Table.Cell>
                                    <Table.Cell>{ item.uuid_dataset }</Table.Cell>
                                    <Table.Cell>{ item.editor_name }</Table.Cell>
                                </Table.Row>
                            })}
                        </Table.Body>
                    </Table>
                </div>
            </Center>
        }
    }

    render() {
        return (
            <div>
                <Divider horizontal className="mm">View Data</Divider>
                { this.showEntriesGrid() }
                <Divider horizontal className="mm">View Revs</Divider>
                { this.showRevisionsGrid() }
                <Divider horizontal className="mm">View Blockchain Values</Divider>
                { this.showBcValuesGrid() }
            </div>
        );
    }
}

export default ViewComponent;