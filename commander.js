class Commander {

  constructor(client, prefix = '!') {
    this.commands = []
    this.prefix = prefix
    this.client = client
    this.listen()
  }

  listen() {
    this.client.on('message', message => {
      try {
        this.commands.forEach((cmd) => {
          if(message.content.startsWith(`${this.prefix}${cmd.command}`))
            cmd.handler(message.content.replace(`${this.prefix}${cmd.command}`, '').trim(), message)
        })
      } catch(e) {
        message.reply('ops! Algo inesperado aconteceu e não posso atender seu pedido.')
      }
    })
  }

  register(command, handler) {
    this.commands.push({
      command: command,
      handler: handler
    })
  }
}

module.exports = Commander
