class Commander {

  constructor(prefix = '!') {
    this.commands = []
    this.prefix = prefix
  }

  parse(message, argument) {
    this.commands.forEach((cmd) => {
      if (message.startsWith(`${this.prefix}${cmd.command}`))
        cmd.handler(message.replace(`${this.prefix}${cmd.command}`, '').trim(), argument)
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
