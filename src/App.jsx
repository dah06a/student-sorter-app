import React, { Component } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './App.css';
import Layout from './containers/Layout/Layout';
import Auth from './containers/Auth/Auth';
import UserSettings from './containers/UserSettings/UserSettings';
import Home from './containers/Home/Home';
import Start from './containers/Start/Start';
import ScheduleSelect from './containers/ScheduleSelect/ScheduleSelect';
import StudentSelect from './containers/StudentSelect/StudentSelect';
import Results from './containers/Results/Results';

import * as actions from './store/actions/indexActions';

class App extends Component {
    state = {
        schedule: null,
        studentList: null
    }

    componentDidMount () {
        this.props.onTryAutoSignup();
      }

    render () {

        let routes = (
            <Switch>
                <Route path="/auth" component={Auth} />
                <Route path="/" component={Home} />
            </Switch>
        );

        if (this.props.isAuthenticated) {
            routes = (
                <Switch >
                    <Route path="/settings" component={UserSettings} />
                    <Route path="/start" component={Start} />
                    <Route path="/schedule" component={ScheduleSelect} />
                    <Route path="/students" component={StudentSelect} />
                    <Route path="/results" component={Results} />
                    <Route path="/" component={Home} />
                </Switch>
            );
        }

        return (
            <Layout isAuthenticated={this.props.isAuthenticated}>
                {routes}
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
      isAuthenticated: state.auth.token !== null
    };
  };

  const mapDispatchToProps = dispatch => {
    return {
      onTryAutoSignup: () => dispatch(actions.authCheckState())
    };
  };

  export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
