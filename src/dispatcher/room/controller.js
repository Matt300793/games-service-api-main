const constants = require("@room/constants");
const ServerManager = require("@room/ServerManager");
const createPacket = require("@room/packet");
const hostConfig = require("@config/host");

exports.handleResponse = (socket, data) => {
    const request = this.parsePacket(data);

    switch(request.type) {
        case constants.GAME_SERVER_CONNECT:
            return this.onServerConnects(socket, request.data);
        default:
            return this.emptyResponse();
    }
}

exports.onServerConnects = (socket, data) => {
    const serverInfo = JSON.parse(data)["config"];
    serverInfo.ip = hostConfig.gameHost;
    serverInfo.port = hostConfig.gamePort;
    
    ServerManager.addServer(socket, `${serverInfo.ip}:${serverInfo.port}`);

    console.log(`Successfully connected game server to room ADDRESS=${serverInfo.ip}:${serverInfo.port}`);

    return this.emptyResponse();
}

exports.sendUserToServer = (addr, data) => {
    const packetUserAttr = createPacket(constants.ROOM_MANAGER_USER_ATTRIBUTE, JSON.stringify(data));
    const socket = ServerManager.getServerSocket(addr);
    if (socket == null) {
        return;
    }

    this.sendResponse(socket, packetUserAttr);
}

exports.sendResponse = (socket, response) => {
    const packet = Buffer.alloc(response.length + 12);
    packet.writeInt32BE(response.length + 4, 0);
    packet.writeInt32BE(response.type, 4);
    packet.write(response.data, 8, "utf-8");

    socket.write(packet);
}

exports.emptyResponse = () => {
    return createPacket(0, "");
}

exports.parsePacket = (requestData) => {
    const packetLength = requestData.readInt32BE(0);
    const packetType = requestData.readInt32BE(4);
    const packetData = requestData.toString("utf8", 8, packetLength + 4);

    return createPacket(packetType, packetData);
}