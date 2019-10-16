import TwitchJS from 'twitch-js';
import Handler from './handler.js';

export default class Twitch extends Handler {

  type() {
    return 'twitch';
  }

  connect() {
    this.client = new TwitchJS.client({ // eslint-disable-line babel/new-cap
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username: this.config.username,
        password: this.config.token,
      },
      channels: this.config.channels,
    });

    this.client.on('connecting', () => console.log('twitch: connecting...'));
    this.client.on('connected', () => console.log('twitch: connected!'));
    this.client.on('disconnected', (error) => console.log(`twitch: disconnected!' ${error}`));
    this.client.connect();
  }

  listen() {
    this.client.on('chat', (channel, userstate, message, self) => {
      if (self) {
        return;
      }

      this.emit('message', message, {
        channel,
        handler: this,
      });
    });
  }

  reply(content, attr) {
    this.message(content, attr);
  }

  message(content, attr) {
    attr.client.say(attr.channel, content);
  }
}
