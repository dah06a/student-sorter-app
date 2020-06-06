import * as actionTypes from '../actions/actionTypes';
import { randomStringOfLength, updateObject, getMostRecentSaveOf } from '../../utils/sharedFunctions';

const initialState = {
    students: [],
    title: "",
    saveAndContinue: false,

    savedStudentLists: {},
    loading: false,
    networkError: null,
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

const applySelectedStudentListOption = (state, action) => { //Search through saved schedules by Object.entries for matching title
    const saved = getMostRecentSaveOf(state.savedStudentLists, action.selectedStudentList);
    return updateObject(state, { students: saved.students, title: saved.title });
};

const integrateStudentListOption = (state, action) => {
    let saved = getMostRecentSaveOf(state.savedStudentLists, action.selectedStudentList);
    for (let student of saved.students) { //Loop through each student
        if (action.choices <= student.choices.length) { //Delete choices if there are now fewer
            student.choices = student.choices.slice(0, action.choices);
        } else { //Otherwise, add new empty choices if there are now more
            for (let i = 0; i < (action.choices - student.choices.length); i++) {
                student.choices.push("");
            }
        } //Finally, loop through all choices, and remove options that are no longer available
        for (let [index, option] of student.choices.entries()) {
            if (!action.options.includes(option)) {
                student.choices[index] = "";
            }
        }
    }
    return updateObject(state, { students: saved.students, title: saved.title });
};

const addNewStudent = (state, action) => {
    const newStudent = {
        id: randomStringOfLength(8),
        valid: true,
        name: "",
        choices: [],
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
    if (action.dataType === "valid") { //Set valid properties
        updatedStudents[action.studentIndex].valid = action.data;
    } else if (action.dataType === "name") { //Set name
        updatedStudents[action.studentIndex].valid = true;
        updatedStudents[action.studentIndex].name = action.data;
    } else { //Otherwise dataType is an index for the choice in choices array to be set
        updatedStudents[action.studentIndex].valid = true;
        updatedStudents[action.studentIndex].choices[action.dataType] = action.data;
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

const resetStudentData = (state, action) => {
    return updateObject(state, {
        students: [],
        title: "",
        saveAndContinue: false,

        loading: false,
        networkError: null,
    });
};

const studentReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_SAVED_STUDENT_LISTS_START: return fetchSavedStudentListsStart(state, action);
        case actionTypes.FETCH_SAVED_STUDENT_LISTS_SUCCESS: return fetchSavedStudentListsSuccess(state, action);
        case actionTypes.FETCH_SAVED_STUDENT_LISTS_FAIL: return fetchSavedStudentListsFail(state, action);

        case actionTypes.APPLY_SELECTED_STUDENT_LIST_OPTION: return applySelectedStudentListOption(state, action);
        case actionTypes.INTEGRATE_STUDENT_LIST_OPTION: return integrateStudentListOption(state, action);

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
