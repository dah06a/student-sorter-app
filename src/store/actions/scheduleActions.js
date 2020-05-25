import * as actionTypes from './actionTypes';
import * as dataUtility from '../../utils/dataUtility';

export const addNewRow = () => {
    return {
        type: actionTypes.ADD_NEW_ROW
    };
};

export const deleteRow = (rowId) => {
    return {
        type: actionTypes.DELETE_ROW,
        rowId: rowId
    };
};

export const updateScheduleData = (activityIndex, dataType, data) => {
    return {
        type: actionTypes.UPDATE_SCHEDULE_DATA,
        activityIndex: activityIndex,
        dataType: dataType,
        data: data
    };
};

export const editScheduleTitle = (edit) => {
    return {
        type: actionTypes.EDIT_SCHEDULE_TITLE,
        edit: edit
    };
};

export const applySelectedLoadOption = (selectedSchedule) => {
    return {
        type: actionTypes.APPLY_SELECTED_LOAD_OPTION,
        selectedSchedule: selectedSchedule
    };
};

export const saveScheduleSuccess = (response) => {
    return {
        type: actionTypes.SAVE_SCHEDULE_SUCCESS,
        response: response
    };
};

export const saveScheduleFail = (error) => {
    return {
        type: actionTypes.SAVE_SCHEDULE_FAIL,
        error: error
    };
};

export const saveScheduleStart = () => {
    return {
        type: actionTypes.SAVE_SCHEDULE_START
    };
};

export const saveScheduleInit = (scheduleTitle, schedule, authToken, localId) => {
    return dispatch => {
        dispatch(saveScheduleStart());
        const data = {userId: localId, title: scheduleTitle, activities: schedule, date: new Date()};
        dataUtility.put(`schedules/${scheduleTitle}`, data, authToken)
            .then(response => {
                dispatch(saveScheduleSuccess(response));
             } )
            .catch(error => {
                dispatch(saveScheduleFail(error));
            } );
    };
};

export const setScheduleData = (schedule, scheduleTitle, saveAndContinue) => {
    return {
        type: actionTypes.SET_SCHEDULE_DATA,
        schedule: schedule,
        scheduleTitle: scheduleTitle,
        saveAndContinue: saveAndContinue
    };
};

export const resetScheduleData = () => {
    return {
        type: actionTypes.RESET_SCHEDULE_DATA
    };
};
