import * as actionTypes from '../actions/actionTypes';
import { randomStringOfLength, updateObject } from '../../utils/sharedFunctions';

const initialState = {
    schedule: [],
    scheduleTitle: "",
    saveAndContinue: false,

    savedSchedules: {},
    loading: false,
    networkError: null
};

const fetchSavedSchedulesStart = (state, action) => {
    return updateObject(state, { loading: true });
};

const fetchSavedSchedulesSuccess = (state, action) => {
    return updateObject(state, { savedSchedules: action.savedSchedules, loading: false, networkError: null });
};

const fetchSavedSchedulesFail = (state, action) => {
    return updateObject(state, { networkError: action.errorMessage.message + ": There was a problem retreiving your saved schedules.", loading: false });
};

const applySelectedLoadOption = (state, action) => { //Search through saved schedules by Object.entries for matching title
    const matchingSchedules = Object.entries(state.savedSchedules).filter(schedule => schedule[1].title === action.selectedSchedule);
    let mostRecent = matchingSchedules[0];
    for (let schedule of matchingSchedules) { //Get most recent schedule by comparing key values (saved date)
        if (schedule[0] > mostRecent[0]) mostRecent = schedule;
    }
    return updateObject(state, { schedule: mostRecent[1].activities, scheduleTitle: mostRecent[1].title })
};

const addNewRow = (state, action) => {
    let timeSlotValues = {};
    for (let timeSlot of action.timeSlots) {
        timeSlotValues[timeSlot.label] = false;
    }
    const newActivity = {
        id: randomStringOfLength(8),
        valid: true,
        label: "",
        minimum: null,
        timeSlots: timeSlotValues
    }
    const updatedSchedule = state.schedule.concat(newActivity);
    return updateObject(state, { schedule: updatedSchedule });
};

const deleteRow = (state, action) => {
    const updatedSchedule = state.schedule.filter(activityElem => (activityElem.id !== action.rowId));
    return updateObject(state, { schedule: updatedSchedule });
};

const updateScheduleData = (state, action) => {
    let updatedSchedule = state.schedule.slice();
    updatedSchedule[action.activityIndex].valid = true;
    if (action.dataType !== "label" && action.dataType !== "minimum") { //Edit Time Slots
        updatedSchedule[action.activityIndex].timeSlots[action.dataType] = action.data;
    } else {
        updatedSchedule[action.activityIndex][action.dataType] = action.data; //Else edit label or minimum values
    }
    return updateObject(state, { schedule: updatedSchedule });
};

const editScheduleTitle = (state, action) => {
    return updateObject(state, { scheduleTitle: action.edit });
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
    return updateObject(state, { schedule: [], scheduleTitle: "", saveAndContinue: false, savedSchedules: {}, loading: false, networkError: null })
};

const scheduleReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_SAVED_SCHEDULES_START: return fetchSavedSchedulesStart(state, action);
        case actionTypes.FETCH_SAVED_SCHEDULES_SUCCESS: return fetchSavedSchedulesSuccess(state, action);
        case actionTypes.FETCH_SAVED_SCHEDULES_FAIL: return fetchSavedSchedulesFail(state, action);
        case actionTypes.APPLY_SELECTED_LOAD_OPTION: return applySelectedLoadOption(state, action);

        case actionTypes.ADD_NEW_ROW: return addNewRow(state, action);
        case actionTypes.DELETE_ROW: return deleteRow(state, action);
        case actionTypes.EDIT_SCHEDULE_TITLE: return editScheduleTitle(state, action);
        case actionTypes.UPDATE_SCHEDULE_DATA: return updateScheduleData(state, action);

        case actionTypes.SAVE_SCHEDULE_START: return saveScheduleStart(state, action);
        case actionTypes.SAVE_SCHEDULE_SUCCESS: return saveScheduleSuccess(state, action);
        case actionTypes.SAVE_SCHEDULE_FAIL: return saveScheduleFail(state, action);

        case actionTypes.SET_SCHEDULE_DATA: return setScheduleData(state, action);
        case actionTypes.RESET_SCHEDULE_DATA: return resetScheduleData(state, action);

        default: return state;
    }
};

export default scheduleReducer;
