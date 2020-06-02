import React from 'react';

import './Schedule.css';
import Row from './Row/Row';

const Schedule = ( props ) => {

    let scheduleHeadings = null;
    if (props.timeSlots.length > 0) {
        scheduleHeadings = props.timeSlots.map(timeSlot => {
            const indexFirstSpace = timeSlot.label.trim().indexOf(" ");
            if (indexFirstSpace !== -1) { //If the time slot contains at least 1 space excluding leading/trailing
                const newHeading = (timeSlot.label.slice(0, 3) + ". " + timeSlot.label.slice(indexFirstSpace + 1, indexFirstSpace + 4) + ".");
                return <th style={{width: "10%"}} key={newHeading}>{newHeading}</th>
            } else {
                const newHeading = (timeSlot.label.slice(0, 6) + ".");
                return <th style={{width: "10%"}} key={newHeading}>{newHeading}</th>
            }
        });
    }

    let scheduleRows = null;
    if (props.schedule.length > 0) {
        scheduleRows = props.schedule.map((activity, index) => (
            <Row
                key={activity.id}
                rowId={activity.id}
                index={index}
                valid={activity.valid}
                timeSlots={props.timeSlots}
                activity={activity}
                update={props.update}
                delete={props.delete}
            />
        ) );
    }

    return (
        <table className="ScheduleTable">
            <thead>
                <tr>
                    <td className="Add" colSpan={props.timeSlots.length + 4} onClick={() => props.add(props.timeSlots)}>+ Activity</td>
                </tr>
                <tr>
                    <th>#</th>
                    <th style={{width: "25%"}}>Activity</th>
                    <th style={{width: "10%"}}>Minimum</th>
                    {scheduleHeadings}
                    <th style={{width: "10%"}}>X</th>
                </tr>
            </thead>
            <tbody>
                {scheduleRows}
                <tr>
                    <td className="Add" colSpan={props.timeSlots.length + 4} onClick={() => props.add(props.timeSlots)}>+ Activity</td>
                </tr>
            </tbody>
        </table>
    );
}



export default Schedule;
