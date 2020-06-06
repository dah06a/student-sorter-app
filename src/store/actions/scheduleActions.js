import * as actionTypes from './actionTypes';
import * as dataUtility from '../../utils/dataUtility';

export const fetchSavedSchedulesStart = () => {
    return {
        type: actionTypes.FETCH_SAVED_SCHEDULES_START,
    };
};

export const fetchSavedSchedulesSuccess = (savedSchedules) => {
    return {
        type: actionTypes.FETCH_SAVED_SCHEDULES_SUCCESS,
        savedSchedules: savedSchedules,
    };
};

export const fetchSavedSchedulesFail = (errorMessage) => {
    return {
        type: actionTypes.FETCH_SAVED_SCHEDULES_FAIL,
        errorMessage: errorMessage,
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

export const applySelectedScheduleOption = (selectedSchedule) => {
    return {
        type: actionTypes.APPLY_SELECTED_SCHEDULE_OPTION,
        selectedSchedule: selectedSchedule,
    };
};

export const integrateScheduleOption = (selectedSchedule, timeSlots) => {
    return {
        type: actionTypes.INTEGRATE_SCHEDULE_OPTION,
        selectedSchedule: selectedSchedule,
        timeSlots: timeSlots,
    };
};

export const addNewRow = (timeSlots) => {
    return {
        type: actionTypes.ADD_NEW_ROW,
        timeSlots: timeSlots,
    };
};

export const deleteRow = (rowId) => {
    return {
        type: actionTypes.DELETE_ROW,
        rowId: rowId,
    };
};

export const updateScheduleData = (activityIndex, dataType, data) => {
    return {
        type: actionTypes.UPDATE_SCHEDULE_DATA,
        activityIndex: activityIndex,
        dataType: dataType,
        data: data,
    };
};

export const editScheduleTitle = (edit) => {
    return {
        type: actionTypes.EDIT_SCHEDULE_TITLE,
        edit: edit,
    };
};

export const toggleScheduleContinue = (desiredSetting) => {
    return {
        type: actionTypes.TOGGLE_SCHEDULE_CONTINUE,
        desiredSetting: desiredSetting,
    };
};

export const saveScheduleSuccess = (response) => {
    return {
        type: actionTypes.SAVE_SCHEDULE_SUCCESS,
        response: response,
    };
};

export const saveScheduleFail = (error) => {
    return {
        type: actionTypes.SAVE_SCHEDULE_FAIL,
        error: error,
    };
};

export const saveScheduleStart = () => {
    return {
        type: actionTypes.SAVE_SCHEDULE_START,
    };
};

export const saveScheduleInit = (data, authToken) => {
    return dispatch => {
        dispatch(saveScheduleStart());
        const timestamp = new Date().getTime();
        dataUtility.put(`schedules/${timestamp}`, data, authToken)
            .then(response => {
                dispatch(saveScheduleSuccess(response));
             } )
            .catch(error => {
                dispatch(saveScheduleFail(error));
            } );
    };
};

export const resetScheduleData = () => {
    return {
        type: actionTypes.RESET_SCHEDULE_DATA,
    };
};
