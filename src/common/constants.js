const { dirname } = require("path");

module.exports = {
    ROOT_DIRECTORY: `${dirname(require.main.filename)}/..`,
    
    DECORATION_PATH: "decorations",

    CACHE_GAME_ACCOUNT: "cache.game.token.%s"
}