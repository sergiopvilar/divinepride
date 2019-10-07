import Handler from './handler'
import TwitchJS from 'twitch-js'

export default class Twitch extends Handler {

  constructor(config) {
    this.config = config
    super()
  }

  type() {
    return 'twitch'
  }

  connect() {
    this.client = new TwitchJS.client({
      connection: {
        reconnect: true,
        secure: true
      },
      identity: {
        username: this.config.username,
        password: this.config.token,
      },
      channels: this.config.channels
    })

    this.client.on('connecting', () => console.log('twitch: connecting...'))
    this.client.on('connected', () => console.log('twitch: connected!'))
    this.client.on('disconnected', (r) => console.log('twitch: disconnected!' + r))
    this.client.connect()
  }

  listen() {
    this.client.on('chat', (channel, userstate, message, self) => {
      if (self) return
      this.emit('message', message, {
        channel: channel,
        handler: this
      })
    })
  }

  reply(content, attr) {
    this.message(content, attr)
  }

  message(content, attr) {
    attr.client.say(attr.channel, content)
  }
}
