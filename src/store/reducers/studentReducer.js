import * as actionTypes from '../actions/actionTypes';
import { randomStringOfLength, updateObject } from '../../utils/sharedFunctions';

const initialState = {
    students: [],
    studentListTitle: "",
    saveAndContinue: false,

    savedStudentLists: {},
    loading: false,
    networkError: null
};

const addNewStudent = (state, action) => {
    const newStudent = {
        id: randomStringOfLength(8),
        valid: true,
        name: "",
        choices: []
    };
    for (let i = 0; i < action.choices; i++) {
        newStudent.choices.push("");
    }
    const updatedStudents = state.students.concat(newStudent);
    return updateObject(state, { students: updatedStudents });
};

const deleteStudent = (state, action) => {
    const updatedStudents = state.students.filter(student => student.id !== action.studentId);
    return updateObject(state, { students: updatedStudents });
};

const updateStudentData = (state, action) => {
    let updatedStudents = state.students.slice();
    updatedStudents[action.studentIndex].valid = true;
    if (action.dataType === "name") {
        updatedStudents[action.studentIndex].name = action.data;
    } else {
        const choiceIndex = Object.values(action.dataType);
        updatedStudents[action.studentIndex].choices[choiceIndex] = action.data;
    }
    return updateObject(state, { students: updatedStudents });
};

const editStudentListTitle = (state, action) => {
    return updateObject(state, { studentListTitle: action.edit })
};

const saveStudentsStart = (state, action) => {
    return updateObject(state, { loading: true });
};

const saveStudentsSuccess = (state, action) => {
    console.log(action.response);
    return updateObject(state, { saveAndContinue: true, loading: false, networkError: null });
};

const saveStudentsFail = (state, action) => {
    return updateObject(state, { saveAndContinue: false, loading: false, networkError: action.error.message });
};

const setStudentData = (state, action) => {
    let updatedStudents = action.students;
    for (let student of updatedStudents) {  //Extend or shorten choices based on chosen schedule
        if (action.choices <= student.choices.length) {
            student.choices = student.choices.slice(0, action.choices);
        } else {
            for (let i = 0; i < (action.choices - student.choices.length); i++) {
                student.choices.push("");
            }
        }
        for (let [index, option] of student.choices.entries()) { //Remove options not included in chosen schedule
            if (!action.options.includes(option)) {
                student.choices[index] = "";
            }
        }
    }
    console.log(updatedStudents);
    return updateObject(state, { students: updatedStudents });
};

const resetStudentData = (state, action) => {
    return updateObject(state, { students: [], studentListTitle: "", saveAndContinue: false, loading: false, networkError: null });
};

const studentReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_NEW_STUDENT: return addNewStudent(state, action);
        case actionTypes.DELETE_STUDENT: return deleteStudent(state, action);

        case actionTypes.UPDATE_STUDENT_DATA: return updateStudentData(state, action);
        case actionTypes.EDIT_STUDENT_LIST_TITLE: return editStudentListTitle(state, action);

        case actionTypes.SAVE_STUDENTS_START: return saveStudentsStart(state, action);
        case actionTypes.SAVE_STUDENTS_SUCCESS: return saveStudentsSuccess(state, action);
        case actionTypes.SAVE_STUDENTS_FAIL: return saveStudentsFail(state, action);

        case actionTypes.SET_STUDENT_DATA: return setStudentData(state, action);
        case actionTypes.RESET_STUDENT_DATA: return resetStudentData(state, action);

        default: return state;
    }
};

export default studentReducer;
