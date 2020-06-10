import React from 'react';

import './Student.css';
import Select from '../../UI/Select/Select';

const Student = ( props ) => {
    let studentClasses = "Student";
    if (!props.student.valid) studentClasses = "Student Invalid";

    let studentOptions = [];
    for (let i = 0; i < props.choices; i++) {
        studentOptions.push(
            <td  key={"choice" + i}>
                <Select
                    selectWidth="90%"
                    label={props.student.choices[i] === "" ? "Select Option" : props.student.choices[i]}
                    options={props.options}
                    value={props.student.choices[i]}
                    clicked={(event) => props.update(props.index, i, event.target.value)}
                />
            </td>
        );
    }

    return (
        <tr className={studentClasses}>
            <td>{props.index+1}</td>
            <td>
                <input
                    style={{width: "90%"}}
                    placeholder="Name"
                    maxLength="255"
                    value={props.student.name}
                    onChange={(event) => props.update(props.index, "name", event.target.value)}
                />
            </td>
            {studentOptions}
            <td data-hover="Delete" onClick={() => props.delete(props.student.id)}>Delete</td>
        </tr>
    );
};

export default Student;
