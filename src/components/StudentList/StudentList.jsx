import React from 'react';

import './StudentList.css';
import Student from './Student/Student';

const StudentList = ( props ) => {

    let headings = [];
    for (let i = 1; i <= props.choices; i++) {
        headings.push(
            <th key={"choice" + i}>
                {"Choice " + i}
            </th>
        );
    }

    let students = props.students.map((student, index) => (
            <Student
                key={student.id}
                valid={student.valid}
                studentId={student.id}
                index={index}
                choices = {props.choices}
                options={props.options}
                update={props.update}
                delete={props.delete}
                values={student}
            />
        ) );

    return (
        <table className="StudentList">
            <thead>
                <tr>
                    <td className="Add" colSpan={props.choices + 3} onClick={() => props.add(props.choices)}>+ Student</td>
                </tr>
                <tr>
                    <th>#</th>
                    <th>Student Name</th>
                    {headings}
                    <th>X</th>
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
