import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/sharedFunctions'

const initialState = {
    results: [],
    loading: false,
    networkError: null,
};

const fetchResultsStart = (state, action) => {
    return updateObject(state, { loading: true, networkError: false, });
};

const fetchResultsSuccess = (state, action) => {
    return updateObject(state, { results: action.results, loading: false, networkError: false, });
};

const fetchResultsFail = (state, action) => {
    return updateObject(state, {loading: false, networkError: action.error, });
};

const resultsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.FETCH_RESULTS_START: return fetchResultsStart(state, action);
        case actionTypes.FETCH_RESULTS_SUCCESS: return fetchResultsSuccess(state, action);
        case actionTypes.FETCH_SAVED_SCHEDULES_FAIL: return fetchResultsFail(state, action);

        default: return state;
    }
};

export default resultsReducer;
