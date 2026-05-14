function methodNotAllowed() {
    return {
        status: 400,
        content: {
            code: 400,
            message: "The method is not supported",
            data: null   
        }
    }
}

function notFound() {
    return {
        status: 404,
        content: {
            code: 404,
            message: "The endpoint is not found",
            data: null
        }
    }
}

function success(data) {
    return {
        status: 200,
        content: {
            code: 1,
            message: "SUCCESS",
            data: data ?? null
        }
    }
}

function innerError() {
    return {
        status: 500,
        content: {
            code: 4,
            message: "INNER ERROR",
            data: null
        }
    }
}

function fileNotFound() {
    return {
        status: 404,
        content: {
            code: 404,
            message: "The file you tried to access wasn't found",
            data: null
        }
    }
}

function fileFound(file) {
    return {
        status: 200,
        content: file
    }
}

function dispatchAuthFailed() {
    return {
        status: 401,
        content: {
            code: 1001,
            info: "Invalid userId or token"
        }
    }
}

function requiresGameAuthParams() {
    return {
        status: 400,
        content: {
            code: 400,
            message: "userId and access-token are expected"
        }
    }
}

function profileNotExists() {
    return {
        status: 200,
        content: {
            code: 1002,
            message: "The profile doesn't exist",
            data: null
        }
    }
}

module.exports = {
    methodNotAllowed: methodNotAllowed,
    notFound: notFound,
    success: success,
    innerError: innerError,
    fileNotFound: fileNotFound,
    fileFound: fileFound,
    dispatchAuthFailed: dispatchAuthFailed,
    requiresGameAuthParams: requiresGameAuthParams,
    profileNotExists: profileNotExists
}