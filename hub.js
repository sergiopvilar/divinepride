import Client from './clients/client.js'
import DiscordHandler from './clients/discord.js'
import TwitchHandler from './clients/twitch.js'

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
export default (config) => {
  if (typeof config.api_key)
    throw new Error('api_key is empty and is required to consume DivinePride data')

  if (typeof config.discord_token !== 'undefined')
    Client(config.api_key, new DiscordHandler(config.discord_token))

  if (typeof config.twitch !== 'undefined')
    Client(config.api_key, new TwitchHandler(config.twitch))
}
