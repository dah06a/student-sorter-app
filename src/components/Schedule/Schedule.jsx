import React from 'react';

import './Schedule.css';
import Row from './Row/Row';

const Schedule = ( props ) => {

    let scheduleRows = null;

    if (props.schedule.length > 0) {
        scheduleRows = props.schedule.map((activity, index) => (
            <Row
                key={activity.id}
                valid={activity.valid}
                rowId={activity.id}
                index={index}
                update={props.update}
                delete={props.delete}
                values={activity}
            />
        ) );
    }

    return (
        <table className="ScheduleTable">
            <thead>
                <tr>
                    <th>#</th>
                    <th style={{width: "25%"}}>Activity</th>
                    <th style={{width: "10%"}}>Minimum</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                    <th style={{width: "10%"}}>X</th>
                </tr>
            </thead>
            <tbody>
                {scheduleRows}
            </tbody>
        </table>
    );
}



export default Schedule;
