import React, { Component } from 'react';
import { Card, Divider } from 'semantic-ui-react';

class MainComponent extends Component {
    render() {
        return (
            <div>
                <h1 className="mm">Proposal</h1>

                <Divider horizontal className="mm">Targets</Divider>
                <Card.Group itemsPerRow={3}>
                    <Card className="mm">
                        <Card.Content>
                            <Card.Header>How does data storage using blockchains work; study of f.e. Bitcoin (Everything in Block), Etherium (Dezentralized cloud file storage), ...</Card.Header>
                            <Card.Description>
                                <p>Bitcoin: <i>S. Nakamoto, "Bitcoin: A peer-to-peer electronic cash system", 2008.</i></p>
                                <p>Ethereum: <i>G. Wood, "Ethereum: A secure decentralised generalised transaction ledger", Ethereum Project Yellow Paper, no. 151, 2014.</i></p>
                            </Card.Description>
                        </Card.Content>
                    </Card>

                    <Card className="mm">
                        <Card.Content>
                            <Card.Header>Where could this kind of storage be used and how does it scale; Is there any way to use it as offline storage for mobile apps</Card.Header>
                            <Card.Description>
                                <li>Medical Applications: <i>Xia, Q., Sifah, E., Smahi, A., Amofa, S. and Zhang, X. (2017). BBDS: Blockchain-Based Data Sharing for Electronic Medical Records in Cloud Environments. Information, 8(2), p.44.</i></li>
                                <li>Ensure Data Integrity in Cloud Computing: <i>[8]E. Gaetani, L. Aniello, R. Baldoni, F. Lombardi, A. Margheri and V. Sassone, "Blockchain-Based Database to Ensure Data Integrity in Cloud Computing Environments.", ITASEC, pp. 146-155, 2017.</i></li>
                            </Card.Description>
                        </Card.Content>
                    </Card>

                    <Card className="mm">
                        <Card.Content>
                            <Card.Header>Possibilities of combining blockchains with bigdata storage (BigchainDB, Hyperledger, RethinkDB, MongoDB)</Card.Header>
                            <Card.Description>
                                <i>McConaghy, T., Marques, R., Müller, A., De Jonghe, D., McConaghy, T., McMullen, G., Henderson, R., Bellemare, S. and Granzotto, A. (2016). BigchainDB: A Scalable Blockchain Database. [online] Available at: https://www.bigchaindb.com/whitepaper/bigchaindb-whitepaper.pdf [Accessed 23 Aug. 2017].</i>
                            </Card.Description>
                        </Card.Content>
                    </Card>

                    <Card className="mm">
                        <Card.Content>
                            <Card.Header>Security and scaling of the different technologies</Card.Header>
                        </Card.Content>
                    </Card>

                    <Card className="mm">
                        <Card.Content>
                            <Card.Header>Comparision Blockchain Database - NoSQL Database - SQL Database (Scaling, Transaction Speed, ...)</Card.Header>
                        </Card.Content>
                    </Card>

                    <Card className="mm">
                        <Card.Content>
                            <Card.Header>Building of an application that uses a distributed database with untrustworthy parties (f.e. Application that allows people to take part in medical tests, which could be exploited by the participants if they take part in several of the same tests at once). Showing of Alternatives and comparing results.</Card.Header>
                        </Card.Content>
                    </Card>

                    <Card className="mm">
                        <Card.Content>
                            <Card.Header>Additional_: Alternatives to Blockchain as a Distributed Ledger f.e. Tangle (f.e. IOTA)</Card.Header>
                            <Card.Description>
                                <i>The tangle. (2016). [online] (0.6). Available at: http://iotatoken.com/IOTA_Whitepaper.pdf [Accessed 23 Aug. 2017].</i>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Card.Group>

                <Divider horizontal className="mm">Additional Literature</Divider>
                <Card.Group itemsPerRow={3}>
                    <Card className="mm">
                        <Card.Content>
                            <Card.Header>Easy Start</Card.Header>
                            <Card.Description>
                                <i>Tan, B. (2017). Blockchain - a Database with a Twist. SSRN Electronic Journal.</i>
                            </Card.Description>
                        </Card.Content>
                    </Card>

                    <Card className="mm">
                        <Card.Content>
                            <Card.Header>Current Status of Blockchain Technology</Card.Header>
                            <Card.Description>
                                <i>Yli-Huumo, J., Ko, D., Choi, S., Park, S. and Smolander, K. (2016). Where Is Current Research on Blockchain Technology?—A Systematic Review. PLOS ONE, [online] pp.1-27. Available at: https://doi.org/10.1371/journal.pone.0163477 [Accessed 23 Aug. 2017].</i>
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </div>
        );
    }
}

export default MainComponent;