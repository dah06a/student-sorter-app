import axios from 'axios';

export const get = (dataPath, authToken, localId) => {
    const url = `https://sscom-mvp.firebaseio.com/${dataPath}.json?auth=${authToken}&orderBy="userId"&equalTo="${localId}"`;
    return axios.get(url);
}

export const put = (dataPath, data, authToken) => {
    const url = `https://sscom-mvp.firebaseio.com/${dataPath}.json?auth=${authToken}`;
    return axios.put(url, data);
}

export const post = (email, password, isSignUp) => {
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCnPJQGGQL2Wain_9Bac_ZgJ81usetTggs';
    if (isSignUp) url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCnPJQGGQL2Wain_9Bac_ZgJ81usetTggs';
    const authData = {
        email: email,
        password: password,
        returnSecureToken: true
    }
    return axios.post(url, authData);
}

export const refresh = (refreshToken) => {
    const url = 'https://securetoken.googleapis.com/v1/token?key=AIzaSyCnPJQGGQL2Wain_9Bac_ZgJ81usetTggs';
    const payLoad = {
        grant_type: "refresh_token",
        refreshToken: refreshToken,
    };
    return axios.post(url, payLoad);
};
