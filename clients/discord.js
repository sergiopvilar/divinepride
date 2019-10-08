import Handler from './handler.js'
import Discord from 'discord.js'

export default class DiscordHandler extends Handler {

  type() {
    return 'discord'
  }

  connect() {
    this.client = new Discord.Client();
    this.client.on('ready', () => {
      console.log('discord: connected!')
      this.client.user.setActivity('Digite !dp')
    });
    this.client.login(this.config);
  }

  listen() {
    this.client.on('message', message => {
      this.emit('message', message.content, {
        message: message,
        handler: this
      })
    })
  }

  reply(content, attr) {
    attr.message.reply(content)
  }

  message(content, attr) {
    attr.message.channel.send(content)
  }
}
