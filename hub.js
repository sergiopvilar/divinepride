const TwitchClient = require('./clients/twitch.js')
const DiscordClient = require('./clients/discord.js')

/**
 * Config object
 * {
 *  twitch: {
 *    username: 'foo',
 *    token: 'bar',
 *    channels: []
 *  },
 *  discord_token: 'foo'
 *  api_key: 'foo'
 * }
 */
module.exports = function(config) {
  TwitchClient(config.api_key, config.twitch.username, config.twitch.token, config.twitch.channels)
  DiscordClient(config.api_key, config.discord_token)
}
