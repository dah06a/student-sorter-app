import * as actionTypes from '../actions/actionTypes';
import { randomStringOfLength, updateObject } from '../../utils/sharedFunctions';

const initialState = {
    schedule: [],
    scheduleTitle: "",
    saveAndContinue: false,

    loading: false,
    networkError: null
};

const addNewRow = (state, action) => {
    const newActivity = {
        id: randomStringOfLength(5),
        valid: true,
        label: "",
        minimum: null,
        days: {
            mon: false,
            tue: false,
            wed: false,
            thu: false,
            fri: false,
            sat: false,
            sun: false
        }
    }
    const updatedSchedule = state.schedule.concat(newActivity);
    return updateObject(state, { schedule: updatedSchedule });
};

const deleteRow = (state, action) => {
    const updatedSchedule = state.schedule.filter(activityElem => (activityElem.id !== action.rowId));
    return updateObject(state, { schedule: updatedSchedule });
};

const editScheduleTitle = (state, action) => {
    return updateObject(state, { scheduleTitle: action.edit });
};

const updateScheduleData = (state, action) => {
    let updatedSchedule = state.schedule.slice();
    updatedSchedule[action.activityIndex].valid = true;
    if (action.dataType !== "label" && action.dataType !== "minimum") {
        updatedSchedule[action.activityIndex].days[action.dataType] = action.data;
    } else {
        updatedSchedule[action.activityIndex][action.dataType] = action.data;
    }
    return updateObject(state, { schedule: updatedSchedule });
};

const applySelectedLoadOption = (state, action) => {
    const updatedSchedule = action.selectedSchedule.activities;
    return updateObject(state, { schedule: updatedSchedule })
};

const saveScheduleStart = (state, action) => {
    return updateObject(state, { loading: true });
};

const saveScheduleSuccess = (state, action) => {
    return updateObject(state, { loading: false, networkError: null, saveAndContinue: true });
};

const saveScheduleFail = (state, action) => {
    return updateObject(state, { loading: false, networkError: action.error.message, saveAndContinue: false });
};

const setScheduleData = (state, action) => {
    return updateObject(state, { schedule: action.schedule, scheduleTitle: action.scheduleTitle, saveAndContinue: action.saveAndContinue });
};

const resetScheduleData = (state, action) => {
    return updateObject(state, { schedule: [], scheduleTitle: "", saveAndContinue: false, loading: false, networkError: null })
};

const scheduleReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_NEW_ROW: return addNewRow(state, action);
        case actionTypes.DELETE_ROW: return deleteRow(state, action);
        case actionTypes.EDIT_SCHEDULE_TITLE: return editScheduleTitle(state, action);
        case actionTypes.UPDATE_SCHEDULE_DATA: return updateScheduleData(state, action);

        case actionTypes.APPLY_SELECTED_LOAD_OPTION: return applySelectedLoadOption(state, action);

        case actionTypes.SAVE_SCHEDULE_START: return saveScheduleStart(state, action);
        case actionTypes.SAVE_SCHEDULE_SUCCESS: return saveScheduleSuccess(state, action);
        case actionTypes.SAVE_SCHEDULE_FAIL: return saveScheduleFail(state, action);

        case actionTypes.SET_SCHEDULE_DATA: return setScheduleData(state, action);
        case actionTypes.RESET_SCHEDULE_DATA: return resetScheduleData(state, action);

        default: return state;
    }
};

export default scheduleReducer;
