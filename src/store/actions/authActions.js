import * as actionTypes from './actionTypes';
import * as dataUtility from '../../utils/dataUtility';

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

export const authSuccess = (token, localId) => {
    return  {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        localId: localId,
    };
};

export const authFail = (error) => {
    return  {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
    return {
        type: actionTypes.AUTH_LOGOUT,
    };
};

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

export const authInit = (email, password, isSignUp) => {
    return dispatch => {
        dispatch(authStart());
        dataUtility.post(email, password, isSignUp) 
            .then(response => {
                const expirationTime = response.data.expiresIn * 2000;
                const expirationDate = new Date(new Date().getTime() + expirationTime);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('localId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(expirationTime));
            })
            .catch(error => {
                dispatch(authFail(error));
            });
    };
};

export const authCheckState = () => {
    return dispatch => {
        let token = null;
        token = localStorage.getItem('token');
        if(!token) {
            dispatch(logout());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const localId = localStorage.getItem('localId');
                dispatch(authSuccess(token, localId));
                const expirationTime = expirationDate.getTime() - new Date().getTime();
                dispatch(checkAuthTimeout(expirationTime));
            }
        }
    };
};
