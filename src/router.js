const express = require("express");
const logger = require("./common/logger");
const responses = require("./common/responses");

function init(app) {
    app.use(express.json());

    const dispEndpoints = require("@dispatcher/controller");
    for (var i = 0; i < dispEndpoints.length; i++) {
        createEndpoint(app, dispEndpoints[i]);
    }

    app.all("*", (req, res) => {
        const notFound = responses.notFound();
        res.status(notFound.status).json(notFound.content);
    });
}

function createEndpoint(app, endpoint) {
    app.all(endpoint.path, async (req, res) => {        
        try {
            var startTime = Date.now();
            if (!endpoint.methods.includes(req.method)) {
                const methodNotAllowed = responses.methodNotAllowed();
                res.status(methodNotAllowed.status).json(methodNotAllowed.content);
                return;
            }

            const response = await endpoint.functions[endpoint.methods.indexOf(req.method)](req);
            res.status(response.status).json(response.content);
            var stopTime = Date.now();
            console.log(`[${req.url}] Sent ${req.method}: ${response.status} Operation took ${stopTime - startTime}ms`);
            if (response.status == 500) {
                console.log("\x1b[91m%s\x1b[0m", `Response: ${JSON.stringify(response.content)}`);
            }
        } catch (e) {
            logger.error(`Error occurred with API: ${req.url}`);
            logger.error(e);

            const innerError = responses.innerError();
            res.status(innerError.status).json(innerError.content);
        }
    });
}

module.exports = init;