import Client from './clients/client'
import DiscordHandler from './clients/discord'
import TwitchHandler from './clients/twitch'

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
  Client(config.api_key, new DiscordHandler(config.discord_token))
  Client(config.api_key, new TwitchHandler(config.twitch))
}
