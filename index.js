require('dotenv').config()

const TwitchClient = require('./clients/twitch.js')
const DiscordClient = require('./clients/discord.js')

TwitchClient(process.env.TWITCH_USERNAME, process.env.TWITCH_TOKEN, process.env.TWITCH_CHANNEL.split(','))
DiscordClient(process.env.BOT_TOKEN)
