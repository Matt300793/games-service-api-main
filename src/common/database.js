const fs = require("fs");
const { dirname } = require("path");

const { ROOT_DIRECTORY } = require("@common/constants");
const config = require("@config/database");

const dbCache = {};

function init() {
    const localPath = config.localPath;
    const databasePath = `${ROOT_DIRECTORY}/${localPath}`;

    if (!fs.existsSync(databasePath)) {
        fs.mkdirSync(databasePath);
    }
}

function keyExists(tableName, subKey) {
    return fs.existsSync(getDatabasePath(tableName, subKey));
}

function getKey(tableName, subKey, reload) {
    const keyName = `${tableName}/${subKey}`;
    if (dbCache[keyName] != undefined && !reload) {
        return dbCache[keyName];
    }
    
    const keyPath = getDatabasePath(tableName, subKey);
    if (!fs.existsSync(keyPath)) {
        return null;
    }

    const data = fs.readFileSync(keyPath, "utf-8");
    if (config.cacheList.includes(tableName)) {
        dbCache[keyName] = JSON.parse(data);
    }

    return JSON.parse(data);
}

function getAllKeys(tableName, reload) {
    if (dbCache[tableName] != undefined && !reload) {
        return dbCache[tableName];
    }

    const tablePath = `${ROOT_DIRECTORY}/${config.localPath}/${tableName}`;
    if (!fs.existsSync(tablePath)) {
        return [];
    }

    const keys = fs.readdirSync(tablePath).map(
        x => x = x.replace(".json", "")
    );

    if (config.cacheList.includes(tableName)) {
        dbCache[tableName] = keys;
    }

    return keys;
}

function setKey(tableName, subKey, newData, overwrite) {
    const keyName = `${tableName}/${subKey}`;
    const keyPath = getDatabasePath(tableName, subKey);
    const keyDir = dirname(keyPath);

    if (!fs.existsSync(keyPath) || overwrite) {
        if (!fs.existsSync(keyDir)) {
            fs.mkdirSync(keyDir, { recursive: true });
        }

        if (config.cacheList.includes(tableName)) {
            dbCache[keyName] = newData;
        }

        fs.writeFileSync(keyPath, JSON.stringify(newData));
        return;
    }
    
    //! Experimental: keyData and newData are merged for arrays too 

    // We merge existing and new data
    let keyData = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
    if (Array.isArray(keyData) && Array.isArray(newData)) {
        keyData = newData.concat(keyData); // Newest data is always first
        keyData = Array.from(new Set(keyData)); // Removes duplicated items
    } else {
        Object.assign(keyData, newData);
    }

    if (config.cacheList.includes(tableName)) {
        dbCache[keyName] = keyData;
    }
    
    fs.writeFileSync(keyPath, JSON.stringify(keyData));
}

function removeKey(tableName, subKey) {
    const keyName = `${tableName}/${subKey}`;
    const keyPath = getDatabasePath(tableName, subKey);
    if (!fs.existsSync(keyPath)) {
        return;
    }

    if (dbCache[keyName] != null) {
        delete dbCache[keyName];
    }

    fs.unlinkSync(keyPath);
}

function getDatabasePath(tableName, subKey) {
    return `${ROOT_DIRECTORY}/${config.localPath}/${tableName}/${subKey}.json`;
}

module.exports = {
    init: init,
    keyExists: keyExists,
    getKey: getKey,
    getAllKeys: getAllKeys,
    setKey: setKey,
    removeKey: removeKey
}