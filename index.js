require('dotenv').config()

const Discord = require('discord.js');
const Commander = require('./commander.js');
const DivinePride = require('./divine.js');
const client = new Discord.Client();
const commands = new Commander(client, '!')

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setGame('Digite !dp')
});

commands.register('item', (input, message) => new DivinePride(input, message).search('items'))
commands.register('mob', (input, message) => new DivinePride(input, message).search('monster'))
commands.register('map', (input, message) => new DivinePride(input, message).search('map'))
commands.register('skill', (input, message) => new DivinePride(input, message).search('skill'))
commands.register('npc', (input, message) => new DivinePride(input, message).search('npc'))
commands.register('quest', (input, message) => new DivinePride(input, message).search('quest'))
commands.register('xp', (input, message) => new DivinePride(input, message).exp())

const help = (input, message) => {
  message.channel.send("", {
    "embed": {
      color: 0xffffff,
      title: "Ajuda do DivinePride",
      url: "https://www.divinepride.net",
      description: "Estes são os comandos disponíveis para busca no DivinePride.",
      fields: [
        {
          name: "Pesquisa por Monstros",
          value: "!mob <nome ou ID do monstro>"
        },
        {
          name: "Pesquisa por Itens",
          value: "!item <nome ou ID do item>"
        },
        {
          name: "Pesquisa por Mapas",
          value: "!map <nome ou warp do mapa>"
        },
        {
          name: "Pesquisa por Habilidades",
          value: "!skill <nome da habilidade>"
        },
        {
          name: "Pesquisa por NPC",
          value: "!npc <nome do NPC>"
        },
        {
          name: "Pesquisa por Quest",
          value: "!quest <nome da Quest>"
        },
      ]
    }
  });
}

commands.register('dp', help)

client.login(process.env.BOT_TOKEN);
