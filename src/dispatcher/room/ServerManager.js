const servers = new Map();

function addServer(serverSocket, serverAddr) {
    servers.set(serverSocket, {
        socket: serverSocket,
        serverAddr: serverAddr
    });
}

function removeServer(socket) {
    servers.delete(socket);
}

function removeServerByAddr(serverAddr) {
    var serverArray = Array.from(servers.entries());
    for(var i = 0; i < serverArray.length; i++) {
        if(serverArray[i].serverAddr == serverAddr) {
             servers.delete(serverArray[i].socket);
        }
    }
}

function getServerSocket(serverAddr) {
    var serverArray = Array.from(servers.values());
    for(var i = 0; i < serverArray.length; i++) {
        if(serverArray[i].serverAddr == serverAddr) {
            return serverArray[i].socket;
        }
    }
}

module.exports = {
    addServer: addServer,
    removeServerByAddr: removeServerByAddr,
    getServerSocket: getServerSocket,
    removeServer: removeServer
}