import * as actionTypes from './actionTypes';
import * as dataUtility from '../../utils/dataUtility';

export const addNewStudent = (choices) => {
    return {
        type: actionTypes.ADD_NEW_STUDENT,
        choices: choices
    };
};

export const deleteStudent = (studentId) => {
    return {
        type: actionTypes.DELETE_STUDENT,
        studentId: studentId
    };
};

export const updateStudentData = (studentIndex, dataType, data) => {
    return {
        type: actionTypes.UPDATE_STUDENT_DATA,
        studentIndex: studentIndex,
        dataType: dataType,
        data: data
    };
};

export const editStudentListTitle = (edit) => {
    return {
        type: actionTypes.EDIT_STUDENT_LIST_TITLE,
        edit: edit
    };
};

export const saveStudentsSuccess = (response) => {
    return {
        type: actionTypes.SAVE_STUDENTS_SUCCESS,
        response: response
    };
};

export const saveStudentsFail = (error) => {
    return {
        type: actionTypes.SAVE_STUDENTS_FAIL,
        error: error
    };
};

export const saveStudentsStart = () => {
    return {
        type: actionTypes.SAVE_STUDENTS_START
    };
};

export const saveStudentsInit = (studentListTitle, students, scheduleTitle, authToken, localId) => {
    return dispatch => {
        dispatch(saveStudentsStart());
        const data = {userId: localId, title: studentListTitle, studentList: students, matchingSchedule: scheduleTitle, date: new Date()};
        dataUtility.put(`students/${studentListTitle}`, data, authToken)
            .then(response => {
                dispatch(saveStudentsSuccess(response));
             } )
            .catch(error => {
                dispatch(saveStudentsFail(error));
            } );
    };
};

export const setStudentData = (students, choices, options) => {
    return {
        type: actionTypes.SET_STUDENT_DATA,
        students: students,
        choices: choices,
        options: options
    };
};

export const resetStudentData = () => {
    return {
        type: actionTypes.RESET_STUDENT_DATA
    };
};
