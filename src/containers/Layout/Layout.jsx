import React, { Component } from 'react'


import './Layout.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Breadcrumbs from '../../components/Navigation/Breadcrumbs/Breadcrumbs';

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    render () {
        let breadcrumbs = null;
        if (this.props.isAuthenticated && window.location.pathname.indexOf("new-sort") !== -1) {
            breadcrumbs = <Breadcrumbs history={this.props.history} />;
        }

        return (
            <div className="Layout">
                <Toolbar isAuthenticated={this.props.isAuthenticated} />
                {/*SideDrawer*/}
                <main className="Content">
                    {breadcrumbs}
                    {this.props.children}
                </main>
            </div>
        );
    }
}



export default Layout;
