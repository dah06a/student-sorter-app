import React from 'react'
import { NavLink } from 'react-router-dom';

import './Toolbar.css';

const Toolbar = (props) => {

    let navItems = (
        <ul>
            <li><NavLink exact to="/">Home</NavLink></li>
            <li><NavLink to="/auth">Login</NavLink></li>
        </ul>
    );

    if (props.isAuthenticated) {
        navItems = (
            <ul>
                <li><NavLink exact to="/">Home</NavLink></li>
                <li><NavLink to="/start">New Sort</NavLink></li>
                <li><NavLink to="/settings">Settings</NavLink></li>
            </ul>
        );
    }


    return (
        <header className="Toolbar">
            <h3 className="Logo">LOGO</h3>
            <h3 className="Title">Student Sorter</h3>
            <nav>
                {navItems}
            </nav>
        </header>
    );

};

export default Toolbar;
