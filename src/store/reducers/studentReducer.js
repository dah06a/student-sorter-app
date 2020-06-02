import * as actionTypes from '../actions/actionTypes';
import { randomStringOfLength, updateObject, getMostRecentSaveOf } from '../../utils/sharedFunctions';

const initialState = {
    students: [],
    title: "",
    saveAndContinue: false,

    savedStudentLists: {},
    loading: false,
    networkError: null
};

const fetchSavedStudentListsStart = (state, action) => {
    return updateObject(state, { loading: true });
};

const fetchSavedStudentListsSuccess = (state, action) => {
    return updateObject(state, { savedStudentLists: action.savedStudentLists, loading: false, networkError: null });
};

const fetchSavedStudentListsFail = (state, action) => {
    return updateObject(state, { networkError: action.errorMessage.message + ": There was a problem retreiving your saved student lists.", loading: false });
};

// !!! NEED TO WORK HERE ON THE APPLY REDUCER FUNCTIONALITY !!! //

const applySelectedStudentListOption = (state, action) => { //Search through saved schedules by Object.entries for matching title
    const saved = getMostRecentSaveOf(state.savedStudentLists, action.selectedStudentList);
    return updateObject(state, { students: saved.students, title: saved.title });
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
    return updateObject(state, { title: action.edit })
};

const toggleStudentListContinue = (state, action) => {
    return updateObject(state, { saveAndContinue: action.desiredSetting });
};

const saveStudentsStart = (state, action) => {
    return updateObject(state, { loading: true });
};

const saveStudentsSuccess = (state, action) => {
    return updateObject(state, { saveAndContinue: true, loading: false, networkError: null });
};

const saveStudentsFail = (state, action) => {
    return updateObject(state, { saveAndContinue: false, loading: false, networkError: action.error.message });
};

// const setStudentData = (state, action) => {
//     let updatedStudents = action.students;
//     for (let student of updatedStudents) {  //Extend or shorten choices based on chosen schedule
//         if (action.choices <= student.choices.length) {
//             student.choices = student.choices.slice(0, action.choices);
//         } else {
//             for (let i = 0; i < (action.choices - student.choices.length); i++) {
//                 student.choices.push("");
//             }
//         }
//         for (let [index, option] of student.choices.entries()) { //Remove options not included in chosen schedule
//             if (!action.options.includes(option)) {
//                 student.choices[index] = "";
//             }
//         }
//     }
//     console.log(updatedStudents);
//     return updateObject(state, { students: updatedStudents });
// };

const resetStudentData = (state, action) => {
    return updateObject(state, {
        students: [],
        title: "",
        saveAndContinue: false,

        savedStudentLists: {},
        loading: false,
        networkError: null
    });
};

const studentReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_SAVED_STUDENT_LISTS_START: return fetchSavedStudentListsStart(state, action);
        case actionTypes.FETCH_SAVED_STUDENT_LISTS_SUCCESS: return fetchSavedStudentListsSuccess(state, action);
        case actionTypes.FETCH_SAVED_STUDENT_LISTS_FAIL: return fetchSavedStudentListsFail(state, action);

        case actionTypes.APPLY_SELECTED_STUDENT_LIST_OPTION: return applySelectedStudentListOption(state, action);

        case actionTypes.ADD_NEW_STUDENT: return addNewStudent(state, action);
        case actionTypes.DELETE_STUDENT: return deleteStudent(state, action);
        case actionTypes.UPDATE_STUDENT_DATA: return updateStudentData(state, action);

        case actionTypes.EDIT_STUDENT_LIST_TITLE: return editStudentListTitle(state, action);
        case actionTypes.TOGGLE_STUDENT_LIST_CONTINUE: return toggleStudentListContinue(state, action);

        case actionTypes.SAVE_STUDENTS_START: return saveStudentsStart(state, action);
        case actionTypes.SAVE_STUDENTS_SUCCESS: return saveStudentsSuccess(state, action);
        case actionTypes.SAVE_STUDENTS_FAIL: return saveStudentsFail(state, action);

        case actionTypes.RESET_STUDENT_DATA: return resetStudentData(state, action);

        default: return state;
    }
};

export default studentReducer;
