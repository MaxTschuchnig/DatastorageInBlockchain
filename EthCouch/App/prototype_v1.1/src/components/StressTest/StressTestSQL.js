import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import sjcl from "sjcl";

class StressTestSQL extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: 0,
            counting: false,
            parent: props.parent
        };

        this.url = "http://localhost:12345/api/BatchAddItem";
        this.seq = 0;
    }

    randomDataEntry() {
        let possibleDataTasks = ['Go To Mars', 'Fix Light in Room 434', 'Change Monitor', 'Eat', 'Sleep', 'Exchange Motherboard on 2342c3', 'Find Luke Skywalker', 'Invent FTL', 'Screw Screws on TV', 'Give new Mouse to Steve', 'Enslave Humanity', 'Give useless Advise'];
        let possibleTechnicians = ['Petra', 'Marco', 'Anna', 'Max', 'Susanne', 'Verena', 'Ernst', 'Hermann', 'Thomas', 'Peter', 'Harald', 'Judit', 'Eduard', 'Dejan', 'Sarah', 'Sebastian', 'Steve', 'HAL 9000', 'Hank', 'Dr. Pepper', 'Captain Obvious'];
        let possibleDueDates = ['Today', 'Tomorrow Morning', 'Tomorrow', 'Tomorrow Evening', '2018-12-31', '2020-01-01', '2019-05-05', '2026-07-30', '2050-04-15', 'The Day After Tomorrow', 'Next Summer', '2018-10-05', '2022-11-17', '0000-12-24'];

        let dataTask = possibleDataTasks[Math.floor(Math.random()*possibleDataTasks.length)];
        let technician = possibleTechnicians[Math.floor(Math.random()*possibleTechnicians.length)];
        let due = possibleDueDates[Math.floor(Math.random()*possibleDueDates.length)];

        let ticket = {
            Id: 0,
            task: dataTask,
            technician: technician,
            due_date: due
        };

        return ticket;
    }

    getDataEntries(amount) {
        this.startTimer();

        let items = [];
        for (let i = 0; i < amount; i ++) {
            let item = this.randomDataEntry();
            this.seq++;

            items.push(item);
        }

        for (let i = 0; i < amount; i += 1000) {
            if (i+1000 < amount) {
                this.sendBatch(i, items.slice(i, i+1000), false);
            }
            else {
                let it = items.slice(i, amount);
                this.sendBatch(i, it, true);
            }
        }
    }

    sendBatch(startid, items, last) {
        fetch(this.url, {
            method: 'PUT', // or 'PUT'
            body: JSON.stringify(items), // data can be `string` or {object}!
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                if (last)
                    this.stopTimer();

                console.log('Success: ', response, ' (', startid, ')');
            });
    }

    getHash(object) {
        // Should be salted!
        let bitArray = sjcl.hash.sha256.hash(JSON.stringify(object));
        return sjcl.codec.hex.fromBits(bitArray);
    }

    startTimer() {
        this.setState({
            time: 0,
            counting: true
        });

        setInterval(() => {
            if (this.state.counting === true) {
                this.setState({
                    time: this.state.time + 15
                });
            }
            }, 15);
    }

    stopTimer() {
        this.setState({
            counting: false
        });
    }

    render() {
        return (
            <div>
                Stress Test SQL
                <Button onClick={() => this.getDataEntries(this.state.parent.state.amount)}>Start Stress-Test SQL</Button>
                {this.state.time}
            </div>
        );
    }
}

export default StressTestSQL;