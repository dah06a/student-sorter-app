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