import * as actionTypes from './actionTypes';
import * as dataUtility from '../../utils/dataUtility';

export const fetchResultsStart = () => {
    return {
        type: actionTypes.FETCH_RESULTS_START,
    };
};

export const fetchResultsSuccess = () => {
    return {
        type: actionTypes.FETCH_RESULTS_SUCCESS,
    };
};

export const fetchResultsFail = () => {
    return {
        type: actionTypes.FETCH_RESULTS_FAIL,
    };
};

export const fetchResultsInit = () => {
    return dispatch => {

    };
};
