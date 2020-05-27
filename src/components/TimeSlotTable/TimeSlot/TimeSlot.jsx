import React from 'react';

import './TimeSlot.css';

const TimeSlot = ( props ) => {
    let timeSlotClasses = "TimeSlot";
    if (!props.valid) timeSlotClasses = "TimeSlot Invalid";

    return (
        <tr className={timeSlotClasses}>
            <td>{props.index+1}</td>
            <td>
                <input
                    type="text"
                    placeholder="Time Slot Name"
                    style={{width: "90%"}}
                    maxLength="255"
                    onChange={(event) => props.update(props.index, "label", event.target.value)}
                    value={props.values.label}
                />
            </td>
            <td data-hover="Delete" onClick={() => props.delete(props.rowId)}>Delete</td>
        </tr>
    );

};

export default TimeSlot;
