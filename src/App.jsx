import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { connect } from 'react-redux';

import './App.css';
import Layout from './containers/Layout/Layout';
import Auth from './containers/Auth/Auth';
import UserSettings from './containers/UserSettings/UserSettings';
import About from './containers/About/About';
import Start from './containers/Start/Start';
import ScheduleSelect from './containers/ScheduleSelect/ScheduleSelect';
import StudentSelect from './containers/StudentSelect/StudentSelect';
import Results from './containers/Results/Results';
import Modal from './components/UI/Modal/Modal';
import Button from './components/UI/Button/Button';

import * as actions from './store/actions/indexActions';

class App extends Component {

    componentDidMount () {
        this.props.onTryAutoSignup();
    }

    componentDidUpdate () {
        this.props.onAuthRefresh(this.props.refreshToken);
    }

    render () {
        let routes = (
            <AnimatePresence exitBeforeEnter>
                <Switch location={this.props.location} key={this.props.location.pathname}>
                    <Route path="/auth" component={Auth} />
                    <Route path="/" component={About} />
                </Switch>
            </AnimatePresence>

        );

        if (this.props.isAuthenticated) {
            routes = (
                <AnimatePresence exitBeforeEnter>
                    <Switch location={this.props.location} key={this.props.location.pathname}>
                        <Route path="/settings" component={UserSettings} />
                        <Route path="/results" component={Results} />
                        <Route path="/new-sort/students" component={StudentSelect} />
                        <Route path="/new-sort/schedule" component={ScheduleSelect} />
                        <Route path="/new-sort" component={Start} />
                        <Route path="/" component={About} />
                    </Switch>
                </AnimatePresence>
            );
        }

        let modalContent = <React.Fragment>
            <h3>Logout Warning</h3>
                <p>You are about to be logged out due to inactivity.</p>
                <Button type="Success" clicked={() => this.props.onToggleAuthLogoutWarning(false)}>Continue Working</Button>
        </React.Fragment>

        if (!this.props.isAuthenticated && this.props.authLogoutWarning) {
            modalContent = <React.Fragment>
                <h3>Automatic Logout</h3>
                <p>You have been logged out due to inactivity.</p>
            </React.Fragment>
        }

        return (
            <React.Fragment>

                <div className="ModalArea">
                    <Modal show={this.props.authLogoutWarning} toggle={() => this.props.onToggleAuthLogoutWarning(false)}>
                       {modalContent}
                    </Modal>
                </div>

                <Layout isAuthenticated={this.props.isAuthenticated} history={this.props.history}>
                    {routes}
                </Layout>

            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        refreshToken: state.auth.refresh,
        isAuthenticated: state.auth.token !== null,
        authLogoutWarning: state.auth.logoutWarning,
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      onTryAutoSignup: () => dispatch(actions.authCheckState()),
      onAuthRefresh: (authToken) => dispatch(actions.authRefresh(authToken)),
      onToggleAuthLogoutWarning: (desiredSetting) => dispatch(actions.toggleAuthLogoutWarning(desiredSetting)),
    };
  };

  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
