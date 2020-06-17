import React, { Component } from 'react';

import './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    render () {
        return (
            <div className="Layout">
                <Toolbar isAuthenticated={this.props.isAuthenticated} />
                {/*SideDrawer*/}
                <main className="Content">
                    {this.props.children}
                </main>
            </div>
        );
    }
}



export default Layout;
