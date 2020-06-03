import React from 'react';

import './TimeSlotTable.css';
import TimeSlot from './TimeSlot/TimeSlot';

const TimeSlotTable = ( props ) => {

    let timeSlotInputs = null;

    if (props.timeSlots.length > 0) {
        timeSlotInputs = props.timeSlots.map((timeSlot, index) => (
            <TimeSlot
                key={timeSlot.id}
                index={index}
                id={timeSlot.id}
                valid={timeSlot.valid}
                label={timeSlot.label}
                update={props.update}
                delete={props.delete}
            />
        ) );
    }

    return (
        <table className="TimeSlotTable">
            <thead>
                <tr>
                    <td className="Add" colSpan="3" onClick={() => props.add()}>+ Time Slot</td>
                </tr>
                <tr>
                    <th>#</th>
                    <th style={{width: "70%"}}>Time Slot Labels</th>
                    <th style={{width: "10%"}}>X</th>
                </tr>
            </thead>
            <tbody>
                {timeSlotInputs}
                <tr className="Add">
                    <td colSpan="3" onClick={() => props.add()}>+ Time Slot</td>
                </tr>
            </tbody>
        </table>
    );
}



export default TimeSlotTable;
