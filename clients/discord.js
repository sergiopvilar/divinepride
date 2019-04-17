const Discord = require('discord.js');
const Commander = require('../Commander.js');
const DivinePride = require('../divine.js');
const DiscordCommander = new Commander('!')

function DiscordHanlder(input, message) {
  let dp

  try {
    dp = new DivinePride(input)
    dp.on('message', (txt) => message.channel.send(txt))
    dp.on('reply', (txt) => message.reply(txt))
  } catch (e) {
    console.log('error: ' + e.message)
    message.reply('houve um erro com sua requisição.')
  }

  return dp
}

DiscordCommander.register('item', (input, message) => DiscordHanlder(input, message).search('items'))
DiscordCommander.register('mob', (input, message) => DiscordHanlder(input, message).search('monster'))
DiscordCommander.register('map', (input, message) => DiscordHanlder(input, message).search('map'))
DiscordCommander.register('skill', (input, message) => DiscordHanlder(input, message).search('skill'))
DiscordCommander.register('npc', (input, message) => DiscordHanlder(input, message).search('npc'))
DiscordCommander.register('quest', (input, message) => DiscordHanlder(input, message).search('quest'))
DiscordCommander.register('xp', (input, message) => DiscordHanlder(input, message).exp())
DiscordCommander.register('dp', (input, message) => message.channel.send("", discordHelp))

module.exports = (token) => {
  let DiscordClient

  try {
    DiscordClient = new Discord.Client();

    DiscordClient.on('message', message => DiscordCommander.parse(message.content, message))
    DiscordClient.on('ready', () => {
      console.log('discord: connected!');
      DiscordClient.user.setActivity('Digite !dp')
    });

    DiscordClient.login(token);
  } catch (e) {
    console.log('error: '+ e.message)
  }

}
