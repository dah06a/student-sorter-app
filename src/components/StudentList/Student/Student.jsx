import React from 'react';

import './Student.css';
import Select from '../../UI/Select/Select';

const Student = ( props ) => {
    let studentClasses = "Student";
    if (!props.valid) studentClasses = "Student Invalid";

    let studentOptions = [];
    for (let i = 0; i < props.choices; i++) {
        studentOptions.push(
            <td  key={"choice" + i} style={{minWidth: "100px"}}>
                <Select
                    selectWidth="90%"
                    label="Select Option"
                    options={props.options}
                    value={props.values.choices[i]}
                    clicked={(event) => props.update(props.index, {"choice": i}, event.target.value)}
                />
            </td>
        );
    }

    return (
        <tr className={studentClasses}>
            <td>{props.index+1}</td>
            <td style={{minWidth: "150px"}}>
                <input
                    style={{width: "90%"}}
                    placeholder="Name"
                    maxLength="255"
                    value={props.values.name}
                    onChange={(event) => props.update(props.index, "name", event.target.value)}
                />
            </td>
            {studentOptions}
            <td data-hover="Delete" style={{minWidth: "70px"}} onClick={() => props.delete(props.studentId)}>Delete</td>
        </tr>
    );
};

export default Student;
