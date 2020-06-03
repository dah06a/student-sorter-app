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
    let mostRecentSave = {0: 0};
    for (let save of Object.entries(saveObject).filter(save => save[1].title === withTitle) ) {
        if (save[0] > mostRecentSave[0]) mostRecentSave = save[1];
    }
    return mostRecentSave;
};
