import React from 'react';

import './Row.css';

const Row = ( props ) => {
    let rowClasses = "Row";
    if (!props.valid) rowClasses = "Row Invalid";

    let timeSlotInputs = null;
    if (props.timeSlots) {
        timeSlotInputs = props.timeSlots.map((timeSlot, i) => (
            <td key={timeSlot.label}>
                <input
                    type="checkbox"
                    style={{width: "18px", height: "18px"}}
                    checked={props.activity.timeSlots[timeSlot.label]}
                    onChange={(event) => props.update(props.index, timeSlot.label, event.target.checked)}
                />
            </td>
        ));
    }

    return (
        <tr className={rowClasses}>
            <td>{props.index+1}</td>
            <td>
                <input
                    type="text"
                    placeholder="Activity Name"
                    style={{width: "90%"}}
                    maxLength="255"
                    onChange={(event) => props.update(props.index, "label", event.target.value)}
                    value={props.activity.label}
                />
            </td>
            <td>
                <input
                    type="number"
                    placeholder="0"
                    style={{width: "90%"}}
                    onChange={(event) => props.update(props.index, "minimum", event.target.value)}
                    value={props.activity.minimum ? props.activity.minimum : ""}
                />
            </td>
            {timeSlotInputs}
            <td data-hover="Delete" onClick={() => props.delete(props.rowId)}>Delete</td>
        </tr>
    );

};

export default Row;
