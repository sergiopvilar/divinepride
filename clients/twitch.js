const Commander = require('../Commander.js');
const DivinePride = require('../divine.js');
const TwitchJS = require('twitch-js')
const TwitchCommander = new Commander('!')

function TwitchHandler(message, obj) {
  let dp

  try {
    dp = new DivinePride(message)
    dp.on('message', (txt) => obj.client.say(obj.channel, txt))
    dp.on('reply', (txt) => obj.client.say(obj.channel, txt))
  } catch (e) {
    console.log('error:' + e.message)
    obj.client.say('Houve um erro na sua requisição.')
  }

  return dp
}

TwitchCommander.register('item', (message, obj) => TwitchHandler(message, obj).search('items', false))
TwitchCommander.register('mob', (message, obj) => TwitchHandler(message, obj).search('monster', false))
TwitchCommander.register('map', (message, obj) => TwitchHandler(message, obj).search('map', false))
TwitchCommander.register('skill', (message, obj) => TwitchHandler(message, obj).search('skill', false))
TwitchCommander.register('npc', (message, obj) => TwitchHandler(message, obj).search('npc', false))
TwitchCommander.register('quest', (message, obj) => TwitchHandler(message, obj).search('quest', false))
TwitchCommander.register('xp', (message, obj) => TwitchHandler(message, obj).exp(false))

module.exports = (username, token, channels) => {
  let TwitchClient

  try {
    TwitchClient = new TwitchJS.client({
      connection: {
        reconnect: true,
        secure: true
      },
      identity: {
        username: username,
        password: token,
      },
      channels: channels
    })

    TwitchClient.on('connecting', () => console.log('twitch: connecting...'))
    TwitchClient.on('connected', () => console.log('twitch: connected!'))
    TwitchClient.on('disconnected', (r) => console.log('twitch: disconnected!' + r))
    TwitchClient.on('chat', (channel, userstate, message, self) => {
      if (self) return
      TwitchCommander.parse(message, {
        client: TwitchClient,
        channel: channel
      })
    });

    TwitchClient.connect()
  } catch (e) {
    console.log('error: ' + e.message)
  }
}

