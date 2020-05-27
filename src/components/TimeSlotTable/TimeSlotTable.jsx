import React from 'react';

import './TimeSlotTable.css';
import TimeSlot from './TimeSlot/TimeSlot';

const TimeSlotTable = ( props ) => {

    let timeSlotInputs = null;

    if (props.timeSlots.length > 0) {
        timeSlotInputs = props.timeSlots.map((timeSlot, index) => (
            <TimeSlot
                key={timeSlot.id}
                valid={timeSlot.valid}
                rowId={timeSlot.id}
                index={index}
                update={props.update}
                delete={props.delete}
                values={timeSlot}
            />
        ) );
    }

    return (
        <table className="TimeSlotTable">
            <thead>
                <tr>
                    <th>#</th>
                    <th style={{width: "70%"}}>Time Slot Label</th>
                    <th style={{width: "10%"}}>X</th>
                </tr>
            </thead>
            <tbody>
                {timeSlotInputs}
            </tbody>
        </table>
    );
}



export default TimeSlotTable;
