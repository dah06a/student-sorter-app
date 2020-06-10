import React from 'react';

import './StudentList.css';
import Student from './Student/Student';

const StudentList = ( props ) => {

    let headings = [];
    for (let i = 1; i <= props.choices; i++) {
        headings.push(
            <th key={"choice" + i} style={{minWidth: "150px"}}>
                {"Choice " + i}
            </th>
        );
    }

    let students = props.students.map((student, index) => (
            <Student
                key={student.id}
                index={index}
                choices = {props.choices}
                options={props.options}
                student={student}
                update={props.update}
                delete={props.delete}
            />
        ) );

    return (
        <table className="StudentList">
            <thead>
                <tr>
                    <td className="Add" colSpan={props.choices + 3} onClick={() => props.add(props.choices)}>+ Student</td>
                </tr>
                <tr>
                    <th style={{minWidth: "30px"}}>#</th>
                    <th style={{minWidth: "200px"}}>Student Name</th>
                    {headings}
                    <th style={{minWidth: "60px"}}>X</th>
                </tr>
            </thead>
            <tbody>
                {students}
                <tr>
                    <td className="Add" colSpan={props.choices + 3} onClick={() => props.add(props.choices)}>+ Student</td>
                </tr>
            </tbody>
        </table>
    );
}

export default StudentList;
