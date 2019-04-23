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
 * }
 */
module.exports = function(config) {
  TwitchClient(config.twitch.username, config.twitch.token, config.twitch.channels)
  DiscordClient(config.discord_token)
}
