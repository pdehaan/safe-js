import fs       from 'fs';
import fetch    from 'isomorphic-fetch';

const ROOT_PATH =
{
    APP: 'app',
    DRIVE: 'drive'
};

const SERVER = 'http://localhost:8100/'


// create new directory
export const createDir = function( token, dirPath, isPrivate, userMetadata, isPathShared = false, callback) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    dirPath = dirPath[0] === '/' ? dirPath.slice(1) : dirPath;
    var url = SERVER + 'nfs/directory/' + rootPath + '/' + dirPath;
    var payload = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + token
        },
        body: {
            isPrivate: isPrivate,
            userMetabody: userMetadata
        }
    };
    return fetch( url, payload)
    .then( (response) => {
        if (response.status !== 200 && response.status !== 206)
        {
            console.debug('safe-js.nfs.createDir failed with status ' + response.status + ' ' + response.statusText );
        }

        return response
    });
};

export const deleteDirectory = function( token, dirPath, isPathShared = false, callback) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = SERVER + 'nfs/directory/' + rootPath + '/' + dirPath;
    var payload = {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + token
        }
    };
    return fetch(url, payload)
    .then( (response) => {
        if (response.status !== 200 && response.status !== 206)
        {
            console.debug('safe-js.nfs.deleteDirectory failed with status ' + response.status + ' ' + response.statusText );
        }

        return response
    });
};

export const deleteFile = function( token, filePath, isPathShared = false, callback) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = SERVER + 'nfs/file/' + rootPath + '/' + filePath;
    var payload = {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + token
        }
    };
    return fetch(url, payload)
    .then( (response) => {
        if (response.status !== 200 && response.status !== 206)
        {
            console.debug('safe-js.nfs.deleteFile failed with status ' + response.status + ' ' + response.statusText );
        }

        return response
    });
};

export const createFile = function( token, filePath, dataToWrite, metadata, isPathShared = false, callback)
{
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = SERVER + 'nfs/file/' + rootPath + '/' + filePath;
    var payload = {
        method: 'POST',
        headers: {
            Authorization: 'Bearer ' + token,
            metabody: metadata
        },
        body: JSON.stringify( dataToWrite )
    };

    return fetch( url, payload )
    .then( (response) => {
        if (response.status !== 200 && response.status !== 206)
        {
            console.debug('safe-js.nfs.createFile failed with status ' + response.status + ' ' + response.statusText );
        }

        if( response.status === 200 )
        {
            return response.json().then( json =>
                {
                    response.__parsedResponseBody__ = json
                    return response;
                })
        }
        else {
            return response;
        }

    });
};


// get specific directory
export const getDir = function(token, callback, dirPath, isPathShared = false) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = SERVER + 'nfs/directory/' + rootPath + '/' + dirPath;
    var payload = {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + token
        }
    };
    return fetch( url, payload)
    .then( (response) => {
        if (response.status !== 200 && response.status !== 206)
        {
            console.debug('safe-js.nfs.getDir failed with status ' + response.status + ' ' + response.statusText );
        }

        return response
    });
};


export const getFile = function( token, filePath, isPathShared = false, downloadPath ) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = SERVER + 'nfs/file/' + rootPath + '/' + filePath;
    var payload = {
        headers: {
            'Authorization':'Bearer ' + token,
            'Content-Type':'text/plain'
        }
    };

    return fetch(url, payload)
        .then( (response) => {
            if (response.status !== 200 && response.status !== 206)
            {
                console.debug('safe-js.nfs.getFile failed with status ' + response.status + ' ' + response.statusText );
            }

            if( response.status === 200 )
            {
                return response.json().then( json =>
                    {
                        response.__parsedResponseBody__ = json
                        return response;
                    })
            }
            else {
                return response;
            }
        }).catch( error =>
        {
            console.debug( "safe-js.nfs.getFile response error" , error );
        })

};


// perhaps data object with mime type in there
export const modifyFileContent = function(token, filePath, dataToWrite, isPathShared = false, offset = 0)
{
    var self = this;
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = SERVER + 'nfs/file/' + rootPath + '/' + filePath;

    const payload =
    {
        method: 'PUT',
        headers:
        {
            'Content-Type': 'text/plain',
            // 'Range': 'Bytes=' + offset + '-'
            Authorization: 'Bearer ' + token
        },
        body: JSON.stringify( dataToWrite )
    };

    return fetch(url, payload)
    .then( response =>
        {
            let parsedResponse;
            console.log( "RESPONSSSNNNSESSEE???", response );
            if (response.status !== 200)
            {
                console.debug('safe-js.nfs.modifyFileContent failed with status ' + response.status + ' ' + response.statusText );

                var errMsg = response.body;

                if (!response.status)
                {
                    let errObject = {
                        errorCode: 400,
                        description: 'Request connection closed abruptly'
                    }
                    return errObject;


                }
            }
            if( response.status === 200 )
            {
                return response.json().then( json =>
                    {
                        response.__parsedResponseBody__ = json
                        return response;
                    })
            }
            else {
                return response;
            }
     })
};


export const rename = function(token, path, isPathShared = false, newName, isFile, callback) {
    var rootPath = isPathShared ? ROOT_PATH.DRIVE : ROOT_PATH.APP;
    var url = SERVER + (isFile ? 'nfs/file/metadata/' : 'nfs/directory/') + rootPath + '/' + path;
    var payload = {
        method: 'PUT',
        headers: {
            Authorization: 'Bearer ' + token
        },
        body: {
            name: newName
        }
    };
    return fetch( url, payload)
    .then( (response) => {
        if (response.status !== 200 && response.status !== 206)
        {
            console.debug('safe-js.nfs.deleteDirectory failed with status ' + response.status + ' ' + response.statusText );
        }

        return response
    });
};

export const renameDirectory = function(token, dirPath, isPathShared = false, newName, callback) {
    rename(dirPath, isPathShared, newName, false, callback);
};

export const renameFile = function(oldPath, isPathShared = false, newPath, callback) {
    rename(dirPath, isPathShared, newName, true, callback);
};
