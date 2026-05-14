// src/app.js
require("module-alias/register");
const express = require("express");
const app = express();

require("./router")(app);

const mariadb = require("./common/mariadb");
const database = require("./common/database");
const dressing = require("./common/dressing");
const redis = require("./common/redis");

database.init();
dressing.init();
mariadb.init();
redis.init();

const roomServer = require('./dispatcher/room');
   if (typeof roomServer === 'function') {
       roomServer();
   }

module.exports = app; 