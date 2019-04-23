require('dotenv').config()

const hub = require('./hub.js')({
  discord_token: process.env.BOT_TOKEN,
  twitch: {
    username: process.env.TWITCH_USERNAME,
    token: process.env.TWITCH_TOKEN,
    channels: process.env.TWITCH_CHANNEL.split(',')
  }
})
