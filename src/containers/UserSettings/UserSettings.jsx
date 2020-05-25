import React, { Component } from 'react';
import { connect } from 'react-redux';

import './UserSettings.css';

import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/indexActions';

class UserSettings extends Component {

    logoutHandler = () => {
        this.props.onLogout();
        this.props.onResetScheduleData();
        this.props.onResetStudentData();
    }

    render () {
        return (
            <div className='UserSettings'>
                <h2>Settings Page</h2>
                <h3>Display Name?</h3>
                <h3>Change Password?</h3>
                <h3>Give Access Here For Other Users?</h3>
                <h3>Contact Us?</h3>
                <Button clicked={this.logoutHandler}>Logout</Button>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(actions.logout()),
        onResetScheduleData: () => dispatch(actions.resetScheduleData()),
        onResetStudentData: () => dispatch(actions.resetStudentData())
    };
};

export default connect(null, mapDispatchToProps)(UserSettings);
