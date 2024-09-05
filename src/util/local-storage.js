export {
    saveObject,
    loadObject
};

function localStorageSupport() {
    return typeof localStorage !== "undefined";
}

function saveObject(id, object) {
    if (!localStorageSupport()) {
        return;
    }

    localStorage.setItem(id, JSON.stringify(object));
}

function loadObject(id) {
    if (!localStorageSupport()) {
        return null;
    }

    const data = localStorage.getItem(id);
    if (data && data !== "undefined") {
        return JSON.parse(data);
    }

    return undefined;
}