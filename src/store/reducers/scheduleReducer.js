import * as actionTypes from '../actions/actionTypes';
import { randomStringOfLength, updateObject, getMostRecentSaveOf } from '../../utils/sharedFunctions';

const initialState = {
    schedule: [],
    title: "",
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

const applySelectedScheduleOption = (state, action) => { //Search through saved schedules by Object.entries for matching title
    const saved = getMostRecentSaveOf(state.savedSchedules, action.selectedSchedule);
    const updatedActivities = saved.activities.slice(0, saved.activities.length);
    return updateObject(state, { schedule: updatedActivities, title: action.selectedSchedule, })
};

const integrateScheduleOption = (state, action) => {
    let updatedActivities = getMostRecentSaveOf(state.savedSchedules, action.selectedSchedule).activities;
    for (let i = 0; i < updatedActivities.length; i++) { //Loop through each activity in the schedule
         let updatedTimeSlots = {}; //Create a new object to be used for this activity's time slots
         for (let j = 0; j < action.timeSlots.length; j++) { //Loop through the time slots provided by new given settings
            if (Object.keys(updatedActivities[i].timeSlots).includes(action.timeSlots[j].label)) { //If the old schedule has this given time slot,
                updatedTimeSlots[action.timeSlots[j].label] = updatedActivities[i].timeSlots[action.timeSlots[j].label]; //add it to the updated object
            } else { //Otherwise, create and push a new key using this label, and set the value to false
                updatedTimeSlots[action.timeSlots[j].label] = false;
            }
         } //Set each updated activity time slots to the newly updated/created ones
         updatedActivities[i].timeSlots = updatedTimeSlots;
    }
    return updateObject(state, { schedule: updatedActivities, title: action.selectedSchedule });
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
        timeSlots: timeSlotValues,
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
    if (action.dataType === "valid") { //Set valid properties
        updatedSchedule[action.activityIndex].valid = action.data;
    } else if (action.dataType === "label" || action.dataType === "minimum") { //Set label or minimum
        updatedSchedule[action.activityIndex].valid = true;
        updatedSchedule[action.activityIndex][action.dataType] = action.data;
    } else { //Otherwise, the dataType must be a time slot, so set time slot data
        updatedSchedule[action.activityIndex].valid = true;
        updatedSchedule[action.activityIndex].timeSlots[action.dataType] = action.data;
    }
    return updateObject(state, { schedule: updatedSchedule });
};

const editScheduleTitle = (state, action) => {
    return updateObject(state, { title: action.edit });
};

const toggleScheduleContinue = (state, action) => {
    return updateObject(state, { saveAndContinue: action.desiredSetting });
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

const resetScheduleData = (state, action) => {
    return updateObject(state, {
        schedule: [],
        title: "",
        saveAndContinue: false,

        loading: false,
        networkError: null,
    })
};

const scheduleReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_SAVED_SCHEDULES_START: return fetchSavedSchedulesStart(state, action);
        case actionTypes.FETCH_SAVED_SCHEDULES_SUCCESS: return fetchSavedSchedulesSuccess(state, action);
        case actionTypes.FETCH_SAVED_SCHEDULES_FAIL: return fetchSavedSchedulesFail(state, action);

        case actionTypes.APPLY_SELECTED_SCHEDULE_OPTION: return applySelectedScheduleOption(state, action);
        case actionTypes.INTEGRATE_SCHEDULE_OPTION: return integrateScheduleOption(state, action);

        case actionTypes.ADD_NEW_ROW: return addNewRow(state, action);
        case actionTypes.DELETE_ROW: return deleteRow(state, action);
        case actionTypes.UPDATE_SCHEDULE_DATA: return updateScheduleData(state, action);

        case actionTypes.EDIT_SCHEDULE_TITLE: return editScheduleTitle(state, action);
        case actionTypes.TOGGLE_SCHEDULE_CONTINUE: return toggleScheduleContinue(state, action);

        case actionTypes.SAVE_SCHEDULE_START: return saveScheduleStart(state, action);
        case actionTypes.SAVE_SCHEDULE_SUCCESS: return saveScheduleSuccess(state, action);
        case actionTypes.SAVE_SCHEDULE_FAIL: return saveScheduleFail(state, action);

        case actionTypes.RESET_SCHEDULE_DATA: return resetScheduleData(state, action);

        default: return state;
    }
};

export default scheduleReducer;
