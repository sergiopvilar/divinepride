require('dotenv').config()

const Discord = require('discord.js');
const TwitchJS = require('twitch-js')
const Commander = require('./Commander.js');
const DivinePride = require('./divine.js');
const DiscordClient = new Discord.Client();
const TwitchClient = new TwitchJS.client({
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_TOKEN,
  },
  channels: process.env.TWITCH_CHANNEL.split(',')
})

// Discord Stuff
DiscordClient.on('ready', () => {
  console.log('I am ready!');
  DiscordClient.user.setGame('Digite !dp')
});

function DiscordHanlder(input, message) {
  dp = new DivinePride(input)
  dp.on('message', (txt) => message.channel.send(txt))
  dp.on('reply', (txt) => message.reply(txt))

  return dp
}

const DiscordCommander = new Commander('!')
DiscordClient.on('message', message => DiscordCommander.parse(message.content, message))
DiscordCommander.register('item', (input, message) => DiscordHanlder(input, message).search('items'))
DiscordCommander.register('mob', (input, message) => DiscordHanlder(input, message).search('monster'))
DiscordCommander.register('map', (input, message) => DiscordHanlder(input, message).search('map'))
DiscordCommander.register('skill', (input, message) => DiscordHanlder(input, message).search('skill'))
DiscordCommander.register('npc', (input, message) => DiscordHanlder(input, message).search('npc'))
DiscordCommander.register('quest', (input, message) => DiscordHanlder(input, message).search('quest'))
DiscordCommander.register('xp', (input, message) => DiscordHanlder(input, message).exp())
DiscordCommander.register('dp', (input, message) => message.channel.send("", discordHelp))

DiscordClient.login(process.env.BOT_TOKEN);

// Twitch Stuff
function TwitchHanlder(message, obj) {
  dp = new DivinePride(message)
  dp.on('message', (txt) => obj.client.say(obj.channel, txt))
  dp.on('reply', (txt) => obj.client.say(obj.channel, txt))

  return dp
}

const TwitchCommander = new Commander('!')
TwitchClient.on('chat', (channel, userstate, message, self) => {
  if(self) return
  TwitchCommander.parse(message, {client: TwitchClient, channel: channel})
});

TwitchCommander.register('item', (message, obj) => TwitchHanlder(message, obj).search('items', false))
TwitchCommander.register('mob', (message, obj) => TwitchHanlder(message, obj).search('monster', false))
TwitchCommander.register('map', (message, obj) => TwitchHanlder(message, obj).search('map', false))
TwitchCommander.register('skill', (message, obj) => TwitchHanlder(message, obj).search('skill', false))
TwitchCommander.register('npc', (message, obj) => TwitchHanlder(message, obj).search('npc', false))
TwitchCommander.register('quest', (message, obj) => TwitchHanlder(message, obj).search('quest', false))
TwitchCommander.register('xp', (message, obj) => TwitchHanlder(message, obj).exp(false))

TwitchClient.connect()
