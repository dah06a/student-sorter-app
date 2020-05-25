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

export const fetchSavedSchedulesStart = () => {
    return {
        type: actionTypes.FETCH_SAVED_SCHEDULES_START
    };
};

export const fetchSavedSchedulesSuccess = (savedSchedules) => {
    return {
        type: actionTypes.FETCH_SAVED_SCHEDULES_SUCCESS,
        savedSchedules: savedSchedules
    };
};

export const fetchSavedSchedulesFail = (errorMessage) => {
    return {
        type: actionTypes.FETCH_SAVED_SCHEDULES_FAIL,
        errorMessage: errorMessage
    };
};

export const initLoadSavedSchedules = (authToken, localId) => {
    return dispatch => {
        dispatch(fetchSavedSchedulesStart());
        dataUtility.get("schedules", authToken, localId)
            .then(response => {
                dispatch(fetchSavedSchedulesSuccess(response.data))
            } )
            .catch(error => {
                dispatch(fetchSavedSchedulesFail(error))
            } );
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
