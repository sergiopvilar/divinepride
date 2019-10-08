import dotenv from 'dotenv'
import hub from './hub.js'

dotenv.config()

hub({
  api_key: process.env.API_KEY,
  discord_token: process.env.BOT_TOKEN,
  twitch: {
    username: process.env.TWITCH_USERNAME,
    token: process.env.TWITCH_TOKEN,
    channels: process.env.TWITCH_CHANNEL.split(',')
  }
})
