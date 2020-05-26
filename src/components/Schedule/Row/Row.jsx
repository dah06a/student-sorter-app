import React from 'react';

import './Row.css';

const Row = ( props ) => {
    let rowClasses = "Row";
    if (!props.valid) rowClasses = "Row Invalid";

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
                    value={props.values.label}
                />
            </td>
            <td style={{width: "10%"}}>
                <input
                    type="number"
                    placeholder="0"
                    style={{width: "100%"}}
                    onChange={(event) => props.update(props.index, "minimum", event.target.value)}
                    value={props.values.minimum ? props.values.minimum : ""}
                />
            </td>
            <td><input type="checkbox" checked={props.values.days.mon} onChange={(event) => props.update(props.index, "mon", event.target.checked)} /></td>
            <td><input type="checkbox" checked={props.values.days.tue} onChange={(event) => props.update(props.index, "tue", event.target.checked)} /></td>
            <td><input type="checkbox" checked={props.values.days.wed} onChange={(event) => props.update(props.index, "wed", event.target.checked)} /></td>
            <td><input type="checkbox" checked={props.values.days.thu} onChange={(event) => props.update(props.index, "thu", event.target.checked)} /></td>
            <td><input type="checkbox" checked={props.values.days.fri} onChange={(event) => props.update(props.index, "fri", event.target.checked)} /></td>
            <td><input type="checkbox" checked={props.values.days.sat} onChange={(event) => props.update(props.index, "sat", event.target.checked)} /></td>
            <td><input type="checkbox" checked={props.values.days.sun} onChange={(event) => props.update(props.index, "sun", event.target.checked)} /></td>
            <td data-hover="Delete Row?" style={{width: "10%"}} onClick={() => props.delete(props.rowId)}>Erase</td>
        </tr>
    );

};

export default Row;
