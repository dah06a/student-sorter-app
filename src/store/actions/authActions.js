import * as actionTypes from './actionTypes';
import * as dataUtility from '../../utils/dataUtility';

let timeout = null;
let warning = null;

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, localId, refresh) => {
    return  {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        localId: localId,
        refresh: refresh,
    };
};

export const authFail = (error) => {
    return  {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('localId');
    localStorage.removeItem('refreshToken');
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const toggleAuthLogoutWarning = (desiredSetting) => {
    return {
        type: actionTypes.TOGGLE_AUTH_LOGOUT_WARNING,
        desiredSetting: desiredSetting,
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        warning = setTimeout(() => {
            dispatch(toggleAuthLogoutWarning(true));
        }, expirationTime - expirationTime/30);
        timeout = setTimeout(() => {
            dispatch(authLogout());
        }, expirationTime);
    };
};

export const clearAuthTimeout = () => {
    return dispatch => {
        clearTimeout(warning);
        toggleAuthLogoutWarning(false);
        clearTimeout(timeout);
    };
};

export const authInit = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        dataUtility.post(email, password, isSignUp)
            .then(response => {
                const expirationTime = response.data.expiresIn * 1000;
                const expirationDate = new Date(new Date().getTime() + expirationTime);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('localId', response.data.localId);
                localStorage.setItem('refreshToken', response.data.refreshToken);
                dispatch(authSuccess(response.data.idToken, response.data.localId, response.data.refreshToken));
                dispatch(checkAuthTimeout(expirationTime));
            })
            .catch(error => {
                dispatch(authFail(error));
            });
    };
};

export const authRefresh = (refreshToken) => {
    return dispatch => {
        dataUtility.refresh(refreshToken)
            .then(response => {
                const expirationTime = response.data.expires_in * 1000;
                const expirationDate = new Date(new Date().getTime() + expirationTime);
                localStorage.setItem('token', response.data.id_token);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('localId', response.data.user_id);
                localStorage.setItem('refreshToken', response.data.refresh_token);
                dispatch(authSuccess(response.data.id_token, response.data.user_id, response.data.refresh_token));
                dispatch(clearAuthTimeout());
                dispatch(checkAuthTimeout(expirationTime));
            })
            .catch(error => {
                console.log(error);
            });
    };
};

export const authCheckState = () => {
    return dispatch => {
        let token = null;
        token = localStorage.getItem('token');
        if(!token) {
            dispatch(authLogout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(authLogout());
            } else {
                const localId = localStorage.getItem('localId');
                const refresh = localStorage.getItem('refreshToken');
                dispatch(authSuccess(token, localId, refresh));
                const expirationTime = expirationDate.getTime() - new Date().getTime();
                dispatch(checkAuthTimeout(expirationTime));
            }
        }
    };
};
