import { cloneDeep } from 'lodash';

export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    };
};

export const randomStringOfLength = (desiredLength) => {
    let result = '';
    const options = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < desiredLength; i++) {
        result += options.charAt(Math.floor(Math.random()*options.length));
    }
    return result;
}

export const getMostRecentSaveOf = (saveObject, withTitle) => {
    const saveClone = cloneDeep(saveObject);
    let matchingTitles = Object.entries(saveClone).filter(save => save[1].title === withTitle);
    let mostRecentSave = [0, 0];
    for (let i = 0; i < matchingTitles.length; i++) {
        if (matchingTitles[i][0] > mostRecentSave[0]) {
            mostRecentSave[0] = matchingTitles[i][0];
            mostRecentSave[1] = matchingTitles[i][1];
        }
    }
    return mostRecentSave[1];
};
