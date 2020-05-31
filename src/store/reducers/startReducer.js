import * as actionTypes from '../actions/actionTypes';
import { updateObject, randomStringOfLength } from '../../utils/sharedFunctions';

const initialState = {
    timeSlots: [],
    studentChoices: 0,
    choiceDuplicatesAllowed: false,
    startSettingsTitle: "",

    savedStartSettings: {},
    loading: false,
    networkError: false,

    saveAndContinue: false,
};

const fetchSavedStartSettingsStart = (state, action) => {
    return updateObject(state, { loading: true });
};

const fetchSavedStartSettingsSuccess = (state, action) => {
    return updateObject(state, { savedStartSettings: action.savedStartSettings, loading: false, networkError: null });
};

const fetchSavedStartSettingsFail = (state, action) => {
    return updateObject(state, { networkError: action.errorMessage + ": There was a problem retreiving your saved start settings.", loading: false });
};

const applySelectedStartSettingsOption = (state, action) => { //Search through saved start settings by Object.entries for matching title
    const matchingStartSettings = Object.entries(state.savedStartSettings).filter(startSettings => startSettings[1].title === action.selectedStartSettings);
    let mostRecent = matchingStartSettings[0];
    for (let startSettings of matchingStartSettings) { //Get most recent start settings by comparing key values (saved date)
        if (startSettings[0] > mostRecent[0]) mostRecent = startSettings;
    }
    return updateObject(state, { timeSlots: mostRecent[1].timeSlots, studentChoices: mostRecent[1].studentChoices, choiceDuplicatesAllowed: mostRecent[1].choiceDuplicatesAllowed, startSettingsTitle: mostRecent[1].title });
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

const toggleStartSettingsContinue = (state, action) => {
    const opposite = !state.saveAndContinue;
    return updateObject(state, { saveAndContinue: opposite });
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

const resetStartSettingsData = (state, action) => {
    return updateObject(state, {
        timeSlots: [],
        studentChoices: 0,
        choiceDuplicatesAllowed: false,
        startSettingsTitle: "",

        savedStartSettings: {},
        loading: false,
        networkError: false })
};

const startReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_SAVED_START_SETTINGS_START: return fetchSavedStartSettingsStart(state, action);
        case actionTypes.FETCH_SAVED_START_SETTINGS_SUCCESS: return fetchSavedStartSettingsSuccess(state, action);
        case actionTypes.FETCH_SAVED_START_SETTINGS_FAIL: return fetchSavedStartSettingsFail(state, action);
        case actionTypes.APPLY_SELECTED_START_SETTINGS_OPTION: return applySelectedStartSettingsOption(state, action);

        case actionTypes.ADD_NEW_TIME_SLOT: return addNewTimeSlot(state, action);
        case actionTypes.DELETE_TIME_SLOT: return deleteTimeSlot(state, action);
        case actionTypes.UPDATE_TIME_SLOT_DATA: return updateTimeSlotData(state, action);

        case actionTypes.EDIT_STUDENT_CHOICES: return editStudentChoices(state, action);
        case actionTypes.SET_CHOICE_DUPLICATES: return setChoiceDuplicates(state, action);

        case actionTypes.EDIT_START_SETTINGS_TITLE: return editStartSettingsTitle(state, action);
        case actionTypes.TOGGLE_START_SETTINGS_CONTINUE: return toggleStartSettingsContinue(state, action);

        case actionTypes.SAVE_START_SETTINGS_START: return saveStartSettingsStart(state, action);
        case actionTypes.SAVE_START_SETTINGS_SUCCESS: return saveStartSettingsSuccess(state, action);
        case actionTypes.SAVE_START_SETTINGS_FAIL: return saveStartSettingsFail(state, action);

        case actionTypes.RESET_START_SETTINGS_DATA: return resetStartSettingsData(state, action);

        default: return state;
    }
};

export default startReducer;
