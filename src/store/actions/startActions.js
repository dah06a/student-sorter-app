import * as actionTypes from './actionTypes';
import * as dataUtility from '../../utils/dataUtility';

export const fetchSavedStartSettingsStart = () => {
    return {
        type: actionTypes.FETCH_SAVED_START_SETTINGS_START,
    };
};

export const fetchSavedStartSettingsSuccess = (savedStartSettings) => {
    return {
        type: actionTypes.FETCH_SAVED_START_SETTINGS_SUCCESS,
        savedStartSettings: savedStartSettings,
    };
};

export const fetchSavedStartSettingsFail = (errorMessage) => {
    return {
        type: actionTypes.FETCH_SAVED_START_SETTINGS_FAIL,
        errorMessage: errorMessage,
    };
};

export const initLoadSavedStartSettings = (authToken, localId) => {
    return dispatch => {
        dispatch(fetchSavedStartSettingsStart());
        dataUtility.get("startSettings", authToken, localId)
            .then(response => {
                dispatch(fetchSavedStartSettingsSuccess(response.data))
            } )
            .catch(error => {
                dispatch(fetchSavedStartSettingsFail(error))
            } );
    };
};

export const applySelectedStartSettingsOption = (selectedStartSettings) => {
    return {
        type: actionTypes.APPLY_SELECTED_START_SETTINGS_OPTION,
        selectedStartSettings: selectedStartSettings,
    };
};

export const addNewTimeSlot = () => {
    return {
        type: actionTypes.ADD_NEW_TIME_SLOT,
    };
};

export const deleteTimeSlot = (id) => {
    return {
        type: actionTypes.DELETE_TIME_SLOT,
        id: id,
    };
};

export const updateTimeSlotData = (timeSlotIndex, dataType, data) => {
    return {
        type: actionTypes.UPDATE_TIME_SLOT_DATA,
        timeSlotIndex: timeSlotIndex,
        dataType: dataType,
        data: data,
    };
};

export const editStudentChoices = (value) => {
    return {
        type: actionTypes.EDIT_STUDENT_CHOICES,
        value: value,
    };
};

export const setChoiceDuplicates = () => {
    return {
        type: actionTypes.SET_CHOICE_DUPLICATES,
    };
};

export const editStartSettingsTitle = (data) => {
    return {
        type: actionTypes.EDIT_START_SETTINGS_TITLE,
        data: data,
    };
};

export const toggleStartSettingsContinue = (desiredSetting) => {
    return {
        type: actionTypes.TOGGLE_START_SETTINGS_CONTINUE,
        desiredSetting: desiredSetting,
    };
};

export const saveStartSettingsStart = () => {
    return {
        type: actionTypes.SAVE_START_SETTINGS_START,
    };
};

export const saveStartSettingsSuccess = (response) => {
    return {
        type: actionTypes.SAVE_START_SETTINGS_SUCCESS,
        response: response,
    };
};

export const saveStartSettingsFail = (error) => {
    return {
        type: actionTypes.SAVE_START_SETTINGS_FAIL,
        error: error,
    };
};

export const saveStartSettingsInit = (data, authToken) => {
    return dispatch => {
        dispatch(saveStartSettingsStart());
        const timestamp = new Date().getTime();
        dataUtility.put(`startSettings/${timestamp}`, data, authToken)
            .then(response => {
                dispatch(saveStartSettingsSuccess(response));
             } )
            .catch(error => {
                dispatch(saveStartSettingsFail(error));
            } );
    };
};

export const resetStartData = () => {
    return {
        type: actionTypes.RESET_START_DATA,
    };
};
