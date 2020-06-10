import React, { Component } from 'react';
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
            <div>
                <h2>Results</h2>
            </div>
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
