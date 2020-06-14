import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';

import './Results.css';

class Results extends Component {

    componentDidMount () {
        // console.log("Ready to send the following:");
        // console.log(this.props.start.timeSlots);
        // console.log(this.props.schedule.schedule);
        // console.log(this.props.students.students);
    }

    render () {
        return (
            <motion.div
                className="Results"
                initial={{opacity: 0, transform: "translate(0vw, 100vh)"}}
                animate={{opacity: 1, transform: "translate(0vw, 0vh)"}}
                exit={{opacity: 0, transform: "translate(0vw, 100vh)"}}
                transition={{duration: 0.5, type: "tween"}}
            >
                <h2>Results</h2>
            </motion.div>
        );
    }
}

const mapStateToProps = state => {
    return {
        start: state.start,
        schedule: state.schedule,
        students: state.students,
    };
};

export default connect(mapStateToProps)(Results);
