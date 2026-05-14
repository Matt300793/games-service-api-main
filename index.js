// index.js
const app = require("./src/app");
const logger = require("@common/logger");
const config = require("@config/host");

app.listen(config.dispPort, () => {
  logger.info(`Dispatcher server started PORT=${config.dispPort}`);
});
