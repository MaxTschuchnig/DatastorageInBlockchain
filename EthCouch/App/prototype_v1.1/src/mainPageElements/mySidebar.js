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
                <Link to='/idb'>
                    <Menu.Item><Icon name="folder"/>idb</Menu.Item>
                </Link>
                <Link to='/eth'>
                    <Menu.Item><Icon name="chain"/>eth</Menu.Item>
                </Link>
                <Link to='/ethcouch'>
                    <Menu.Item><Icon name="retweet"/>ethcouch</Menu.Item>
                </Link>
                <Link to='/stress'>
                    <Menu.Item><Icon name="forward"/>stress-test</Menu.Item>
                </Link>
            </nav>
        );
    }
}

export default MySidebar;