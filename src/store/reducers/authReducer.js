import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/sharedFunctions' ;

const initialState = {
    token: null,
    localId: null,
    authError: null,
    loading: false,
};

const authStart = ( state, action ) => {
    return updateObject( state, { authError: null, loading: true } );
};

const authSuccess = ( state, action ) => {
    return updateObject( state, { token: action.token, localId: action.localId, authError: null, loading: false });
};

const authFail = ( state, action ) => {
    return updateObject( state, { authError: action.error.response.data.error.message, loading: false });
};

const authLogout = ( state, action ) => {
    return updateObject( state, {token: null, localId: null });
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        default: return state;
    }
};

export default authReducer;