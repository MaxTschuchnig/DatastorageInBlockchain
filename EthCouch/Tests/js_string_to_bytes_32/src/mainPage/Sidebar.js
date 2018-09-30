import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Icon, Menu } from 'semantic-ui-react';

class MySidebar extends Component {
    render() {
        return (
            <nav>
                <Link to='/'>
                    <Menu.Item><Icon name="home" />home</Menu.Item>
                </Link>
                <Link to='/stb32'>
                    <Menu.Item><Icon name="folder"/>string to byte32</Menu.Item>
                </Link>
            </nav>
        );
    }
}

export default MySidebar;