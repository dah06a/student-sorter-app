import React from 'react';

import './Result.css';
import Button from '../UI/Button/Button';
import ToggleSwitch from '../UI/ToggleSwitch/ToggleSwitch';

const Result = (props) => {
    let result = <React.Fragment>
        <ToggleSwitch />
        <p>{new Date(props.date).toUTCString()}</p>
        <p>Settings: {props.settings.length > 10 ? props.settings.substring(0, 10) + "..." : props.settings}</p>
        <p>Schedule: {props.schedule.length > 10 ? props.schedule.substring(0, 10) + "..." : props.schedule}</p>
        <p>Students: {props.students > 10 ? props.students.substring(0, 10) + "..." : props.students}</p>
    </React.Fragment>

    if (props.class === "Result Expand") {
        result = <React.Fragment>
            <div className="TitleArea">
                <h4>Date: {new Date(props.date).toString()}</h4>
                <h4>Settings: {props.settings}</h4>
                <h4>Schedule: {props.schedule}</h4>
                <h4>Students: {props.students}</h4>
            </div>
            <div className="ButtonArea">
                <Button>Create PDF</Button>
                <Button>Share</Button>
                <Button>Sort Again</Button>
            </div>
            <div className="ResultsArea">
                <p>{props.results}</p>
            </div>
        </React.Fragment>
    }

    return (
        <div className={"Result " + props.class} onClick={props.clicked(props.id)}>
            {result}
        </div>
    );
};

export default Result;
