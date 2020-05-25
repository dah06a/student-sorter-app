import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Results.css';

class Results extends Component {

    componentDidMount () {
        console.log("Ready to send the following:");
        console.log(this.props.schedule);
        console.log(this.props.students);
        console.log(this.props.sortOption + " (0 = Cursory, 1 = Good, 2 = Thorough, 3 = Overkill");
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
        schedule: state.schedule.schedule,
        students: state.students.students,
        sortOption: state.start.sortOption
    };
};

export default connect(mapStateToProps)(Results);
