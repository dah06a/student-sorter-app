import * as actionTypes from './actionTypes';
import * as dataUtility from '../../utils/dataUtility';

export const fetchSavedStudentListsStart = () => {
    return {
        type: actionTypes.FETCH_SAVED_STUDENT_LISTS_START,
    };
};

export const fetchSavedStudentListsSuccess = (savedStudentLists) => {
    return {
        type: actionTypes.FETCH_SAVED_STUDENT_LISTS_SUCCESS,
        savedStudentLists: savedStudentLists,
    };
};

export const fetchSavedStudentListsFail = (errorMessage) => {
    return {
        type: actionTypes.FETCH_SAVED_STUDENT_LISTS_FAIL,
        errorMessage: errorMessage,
    };
};

export const initLoadSavedStudentLists = (authToken, localId) => {
    return dispatch => {
        dispatch(fetchSavedStudentListsStart());
        dataUtility.get("studentLists", authToken, localId)
            .then(response => {
                dispatch(fetchSavedStudentListsSuccess(response.data))
            } )
            .catch(error => {
                dispatch(fetchSavedStudentListsFail(error))
            } );
    };
};

export const applySelectedStudentListOption = (selectedStudentList) => {
    return {
        type: actionTypes.APPLY_SELECTED_STUDENT_LIST_OPTION,
        selectedStudentList: selectedStudentList,
    };
};

export const integrateStudentListOption = (selectedStudentList, choices, options) => {
    return {
        type: actionTypes.INTEGRATE_STUDENT_LIST_OPTION,
        selectedStudentList: selectedStudentList,
        choices: choices,
        options: options,
    };
};

export const addNewStudent = (choices) => {
    return {
        type: actionTypes.ADD_NEW_STUDENT,
        choices: choices,
    };
};

export const deleteStudent = (studentId) => {
    return {
        type: actionTypes.DELETE_STUDENT,
        studentId: studentId,
    };
};

export const updateStudentData = (studentIndex, dataType, data) => {
    return {
        type: actionTypes.UPDATE_STUDENT_DATA,
        studentIndex: studentIndex,
        dataType: dataType,
        data: data,
    };
};

export const editStudentListTitle = (edit) => {
    return {
        type: actionTypes.EDIT_STUDENT_LIST_TITLE,
        edit: edit,
    };
};

export const toggleStudentListContinue = (desiredSetting) => {
    return {
        type: actionTypes.TOGGLE_STUDENT_LIST_CONTINUE,
        desiredSetting: desiredSetting,
    };
};

export const saveStudentsSuccess = (response) => {
    return {
        type: actionTypes.SAVE_STUDENTS_SUCCESS,
        response: response,
    };
};

export const saveStudentsFail = (error) => {
    return {
        type: actionTypes.SAVE_STUDENTS_FAIL,
        error: error,
    };
};

export const saveStudentsStart = () => {
    return {
        type: actionTypes.SAVE_STUDENTS_START,
    };
};

export const saveStudentsInit = (data, authToken) => {
    return dispatch => {
        dispatch(saveStudentsStart());
        const timeStamp = new Date().getTime();
        dataUtility.put(`studentLists/${timeStamp}`, data, authToken)
            .then(response => {
                dispatch(saveStudentsSuccess(response));
             } )
            .catch(error => {
                dispatch(saveStudentsFail(error));
            } );
    };
};

export const resetStudentData = () => {
    return {
        type: actionTypes.RESET_STUDENT_DATA,
    };
};
