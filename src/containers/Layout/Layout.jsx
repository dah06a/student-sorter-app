import React, { Component } from 'react'

import './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideMenu from '../../components/Navigation/SideMenu/SideMenu';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    render ( props ) {

        return (
            <div className="Layout">
                <Toolbar isAuthenticated={this.props.isAuthenticated} />
                <div className="Body">
                    {/*SideDrawer*/}
                    <SideMenu isAuthenticated={this.props.isAuthenticated} />
                    <main className="Content">
                        {this.props.children}
                    </main>
                </div>
            </div>
        );
    }
}

export default Layout;