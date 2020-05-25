import axios from 'axios';

export function get(dataPath, authToken, localId) {
    let url = `https://sscom-mvp.firebaseio.com/${dataPath}.json?auth=${authToken}&orderBy="userId"&equalTo="${localId}"`;
    return axios.get(url);
}

export function put(dataPath, data, authToken) {
    let url = `https://sscom-mvp.firebaseio.com/${dataPath}.json?auth=${authToken}`;
    return axios.put(url, data);
}

export function post(email, password, isSignUp) {
    let url;
    if (isSignUp) {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCnPJQGGQL2Wain_9Bac_ZgJ81usetTggs';
    } else {
        url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCnPJQGGQL2Wain_9Bac_ZgJ81usetTggs';
    }
    const authData = {
        email: email,
        password: password,
        returnSecureToken: true
    }
    return axios.post(url, authData);
}
