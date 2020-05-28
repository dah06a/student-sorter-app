import * as actionTypes from '../actions/actionTypes';
import { updateObject, randomStringOfLength } from '../../utils/sharedFunctions';

const initialState = {
    timeSlots: [],
    studentChoices: 0,
    choiceDuplicatesAllowed: false,
    startSettingsTitle: "",

    savedStartSettings: {},
    loading: false,
    networkError: false
};

const addNewTimeSlot = (state, action) => {
    const newTimeSlot = {
        id: randomStringOfLength(8),
        valid: true,
        label: ""
    };
    const updatedTimeSlots = state.timeSlots.concat(newTimeSlot);
    return updateObject(state, { timeSlots: updatedTimeSlots });
};

const deleteTimeSlot = (state, action) => {
    const updatedTimeSlots = state.timeSlots.filter(timeSlot => timeSlot.id !== action.id);
    return updateObject(state, { timeSlots: updatedTimeSlots });
};

const updateTimeSlotData = (state, action) => {
    let updatedTimeSlots = state.timeSlots.slice();
    updatedTimeSlots[action.timeSlotIndex].valid = true;
    updatedTimeSlots[action.timeSlotIndex].label = action.data;
    return updateObject(state, { timeSlots: updatedTimeSlots });
};

const editStudentChoices = (state, action) => {
    return updateObject(state, { studentChoices: action.value });
};

const setChoiceDuplicates = (state, action) => {
    let updateDuplicatesAllowed = true;
    if (state.choiceDuplicatesAllowed) updateDuplicatesAllowed = false;
    return updateObject(state, { choiceDuplicatesAllowed: updateDuplicatesAllowed });
};

const editStartSettingsTitle = (state, action) => {
    return updateObject(state, { startSettingsTitle: action.data });
};

const saveStartSettingsStart = (state, action) => {
    return updateObject(state, { loading: true });
};

const saveStartSettingsSuccess = (state, action) => {
    return updateObject(state, { loading: false, networkError: null, saveAndContinue: true });
};

const saveStartSettingsFail = (state, action) => {
    return updateObject(state, { loading: false, networkError: action.error.message, saveAndContinue: false });
};

const startReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ADD_NEW_TIME_SLOT: return addNewTimeSlot(state, action);
        case actionTypes.DELETE_TIME_SLOT: return deleteTimeSlot(state, action);
        case actionTypes.UPDATE_TIME_SLOT_DATA: return updateTimeSlotData(state, action);

        case actionTypes.EDIT_STUDENT_CHOICES: return editStudentChoices(state, action);
        case actionTypes.SET_CHOICE_DUPLICATES: return setChoiceDuplicates(state, action);
        case actionTypes.EDIT_START_SETTINGS_TITLE: return editStartSettingsTitle(state, action);

        case actionTypes.SAVE_START_SETTINGS_START: return saveStartSettingsStart(state, action);
        case actionTypes.SAVE_START_SETTINGS_SUCCESS: return saveStartSettingsSuccess(state, action);
        case actionTypes.SAVE_START_SETTINGS_FAIL: return saveStartSettingsFail(state, action);

        default: return state;
    }
};

export default startReducer;
