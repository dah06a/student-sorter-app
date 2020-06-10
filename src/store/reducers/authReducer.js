import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../utils/sharedFunctions' ;

const initialState = {
    token: null,
    localId: null,
    refresh: null,
    logoutWarning: false,
    authError: null,
    loading: false,
};

const authStart = ( state, action ) => {
    return updateObject( state, { authError: null, loading: true, } );
};

const authSuccess = ( state, action, refresh ) => {
    return updateObject( state, { token: action.token, localId: action.localId, refresh: action.refresh, authError: null, loading: false });
};

const authFail = ( state, action ) => {
    return updateObject( state, { authError: action.error.message, loading: false, });
};

const authLogout = ( state, action ) => {
    return updateObject( state, {token: null, localId: null, refresh: null, });
};

const toggleAuthLogoutWarning = ( state, action ) => {
    return updateObject( state, { logoutWarning: action.desiredSetting, });
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state, action);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);

        case actionTypes.AUTH_LOGOUT: return authLogout(state, action);
        case actionTypes.TOGGLE_AUTH_LOGOUT_WARNING: return toggleAuthLogoutWarning(state, action);

        default: return state;
    }
};

export default authReducer;
