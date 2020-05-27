import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/sharedFunctions';

const initialState = {
    savedSchedules: [],
    scheduleFetchError: null,

    savedStudentLists: [],
    studentFetchError: null,

    timeSlots: [0, 1, 2, 3],

    choiceOption: 0,
    choiceDuplicatesAllowed: false,

    loading: false,
};

const setScheduleOption = (state, action) => {
    return updateObject(state, { scheduleOption: action.option });
};

const selectSchedule = (state, action) => {
    return updateObject(state, { selectedSchedule: action.schedule });
};

const setStudentOption = (state, action) => {
    return updateObject(state, { studentOption: action.option });
};

const selectStudentList = (state, action) => {
    return updateObject(state, { selectedStudentList: action.studentList });
};

const fetchSavedStudentListsStart = (state, action) => {
    return updateObject(state, { loading: true });
};

const fetchSavedStudentListsSuccess = (state, action) => {
    return updateObject(state, { savedStudentLists: action.savedStudentLists, loading: false, studentFetchError: null });
};

const fetchSavedStudentListsFail = (state, action) => {
    return updateObject(state, { studentFetchError: action.errorMessage.message + ": There was a problem retreiving your saved student lists.", loading: false });
};

const setChoiceOption = (state, action) => {
    return updateObject(state, { choiceOption: action.value });
};

const setChoiceDuplicates = (state, action) => {
    let updatedDuplicatesValue = true;
    if (state.choiceDuplicatesAllowed) updatedDuplicatesValue = false;
    return updateObject(state, { choiceDuplicatesAllowed: updatedDuplicatesValue });
};

const setSortOption = (state, action) => {
    return updateObject(state, { sortOption: action.value });
};

const startReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SCHEDULE_OPTION: return setScheduleOption(state, action);
        case actionTypes.SELECT_SCHEDULE: return selectSchedule(state, action);

        case actionTypes.SET_STUDENT_OPTION: return setStudentOption(state, action);
        case actionTypes.SELECT_STUDENT_LIST: return selectStudentList(state, action);
        case actionTypes.FETCH_SAVED_STUDENT_LISTS_START: return fetchSavedStudentListsStart(state, action);
        case actionTypes.FETCH_SAVED_STUDENT_LISTS_SUCCESS: return fetchSavedStudentListsSuccess(state, action);
        case actionTypes.FETCH_SAVED_STUDENT_LISTS_FAIL: return fetchSavedStudentListsFail(state, action);

        case actionTypes.SET_CHOICE_OPTION: return setChoiceOption(state, action);
        case actionTypes.SET_CHOICE_DUPLICATES: return setChoiceDuplicates(state, action);

        case actionTypes.SET_SORT_OPTION: return setSortOption(state, action);

        default: return state;
    }
};

export default startReducer;
