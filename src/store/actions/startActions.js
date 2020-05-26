import * as actionTypes from './actionTypes';
import * as dataUtility from '../../utils/dataUtility';

export const setScheduleOption = (option) => {
    return {
        type: actionTypes.SET_SCHEDULE_OPTION,
        option: option
    };
};

export const selectSchedule = (schedule) => {
    return {
        type: actionTypes.SELECT_SCHEDULE,
        schedule: schedule
    };
};

export const setStudentOption = (option) => {
    return {
        type: actionTypes.SET_STUDENT_OPTION,
        option: option
    };
};

export const selectStudentList = (studentList) => {
    return {
        type: actionTypes.SELECT_STUDENT_LIST,
        studentList: studentList
    };
};

export const fetchSavedStudentListsStart = () => {
    return {
        type: actionTypes.FETCH_SAVED_STUDENT_LISTS_START
    };
};

export const fetchSavedStudentListsSuccess = (savedStudentLists) => {
    return {
        type: actionTypes.FETCH_SAVED_STUDENT_LISTS_SUCCESS,
        savedStudentLists: savedStudentLists
    };
};

export const fetchSavedStudentListsFail = (errorMessage) => {
    return {
        type: actionTypes.FETCH_SAVED_STUDENT_LISTS_FAIL,
        errorMessage: errorMessage
    };
};

export const initLoadSavedStudentLists = (authToken, localId) => {
    return dispatch => {
        dispatch(fetchSavedStudentListsStart());
        dataUtility.get("students", authToken, localId)
            .then(response => {
                dispatch(fetchSavedStudentListsSuccess(response.data))
            } )
            .catch(error => {
                dispatch(fetchSavedStudentListsFail(error))
            } );
    };
};

export const setChoiceOption = (value) => {
    return {
        type: actionTypes.SET_CHOICE_OPTION,
        value: value
    };
};

export const setChoiceDuplicates = () => {
    return {
        type: actionTypes.SET_CHOICE_DUPLICATES
    };
};

export const setSortOption = (value) => {
    return {
        type: actionTypes.SET_SORT_OPTION,
        value: value
    };
};
