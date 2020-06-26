import React, { Component } from 'react';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';

import Result from '../../components/Result/Result';

import './Results.css';



class Results extends Component {
    state = {
        results: [],
        loading: false,
    }

    componentDidMount () {
        //Fetch results from backend later

        const exampleResultData = {
            matchingStartSettings: "Monday Thru Thursday 2020",
            matchingSchedule: "Summer Camp Extended Activities",
            matchingStudentList: "2020 Initial Signup",
            timeStamp: 1592956027521,
            results: {
                "Monday": {
                    "Swimming": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Canoeing": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Ropes": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Soccer": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Board Games": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Dancing": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Science": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Arts and Crafts": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                },
                "Tuesday": {
                    "Swimming": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Canoeing": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Ropes": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Soccer": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Board Games": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Dancing": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Science": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Arts and Crafts": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                },
                "Wednesday": {
                    "Swimming": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Canoeing": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Ropes": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Soccer": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Board Games": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Dancing": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Science": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Arts and Crafts": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                },
                "Thursday": {
                    "Swimming": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Canoeing": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Ropes": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Soccer": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Board Games": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Dancing": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Science": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                    "Arts and Crafts": ["Alan", "Beatrice", "Cid", "Darcy", "Edward", "Felicia", "George", "Heather", "Isaiah", "Jenn"],
                },
            },
        };

        let exampleResults = [];
        for (let i = 0; i < 25; i++) {
            exampleResults.push(exampleResultData);
            exampleResults[i].class = null;
        }
        this.setState({results: exampleResults});
    }

    expandResultHandler = (id) => {
        let updatedResults = {...this.state.results};
        for (let i = 0; i < updatedResults; i++) {
            if (updatedResults[i].id === id) updatedResults[i].class = "Expand";
            else updatedResults[i].class = null;
        }
    }

    render () {
        const allResults = this.state.results.map((result, index) =>
            <Result
                key={index}
                id={index}
                date={result.timeStamp}
                settings={result.matchingStartSettings}
                schedule={result.matchingSchedule}
                students={result.matchingStudentList}
                results={result.results}
                clicked={(id) => this.expandResultHandler(id)}
            />
        );

        return (
            <motion.div
                className="Results"
                initial={{opacity: 0, transform: "translate(0vw, 100vh)"}}
                animate={{opacity: 1, transform: "translate(0vw, 0vh)"}}
                exit={{opacity: 0, transform: "translate(0vw, 100vh)"}}
                transition={{duration: 0.5, type: "tween"}}
            >
                <h2>Results</h2>
                {allResults}
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
