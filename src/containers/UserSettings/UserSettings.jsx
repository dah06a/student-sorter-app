import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';

import './UserSettings.css';

import Button from '../../components/UI/Button/Button';
import * as actions from '../../store/actions/indexActions';

class UserSettings extends Component {

    logoutHandler = () => {
        this.props.onAuthLogout();
        this.props.onResetStartData();
        this.props.onResetScheduleData();
        this.props.onResetStudentData();
    }

    render () {
        return (
            <motion.div
                className='UserSettings'
                initial={{opacity: 0, transform: "translate(0vw, 100vh)"}}
                animate={{opacity: 1, transform: "translate(0vw, 0vh)"}}
                exit={{opacity: 0, transform: "translate(0vw, 100vh)"}}
                transition={{duration: 0.5, type: "tween"}}
            >
                <h2>Settings Page</h2>
                <h3>Display Name?</h3>
                <h3>Change Password?</h3>
                <h3>Give Access Here For Other Users?</h3>
                <h3>Contact Us?</h3>
                <Button clicked={this.logoutHandler}>Logout</Button>
            </motion.div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthLogout: () => dispatch(actions.authLogout()),
        onResetStartData: () => dispatch(actions.resetStartData()),
        onResetScheduleData: () => dispatch(actions.resetScheduleData()),
        onResetStudentData: () => dispatch(actions.resetStudentData())
    };
};

export default connect(null, mapDispatchToProps)(UserSettings);
