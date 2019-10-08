import ChatbotCommander from 'chatbot-commander'
import discordHelp from '../discordHelp.js'
import DivinePride from '../divine/divine.js'

const Commander = new ChatbotCommander()

function DivineHandler(input, attr) {
  let dp

  try {
    dp = new DivinePride(input, attr.key)
    dp.on('message', (txt) => attr.handler.message(txt, attr))
    dp.on('reply', (txt) => attr.handler.reply(txt, attr))
  } catch (e) {
    console.log('error: ' + e.message)
    attr.handler.reply('houve um erro com sua requisição.', attr)
  }

  return dp
}

Commander.register({
  command: 'item',
  input: true
}, (input, attr) => DivineHandler(input, attr).search('items'))

Commander.register({
  command: 'mob',
  input: true
}, (input, attr) => DivineHandler(input, attr).search('monster'))

Commander.register({
  command: 'map',
  input: true
}, (input, attr) => DivineHandler(input, attr).search('map'))

Commander.register({
  command: 'skill',
  input: true
}, (input, attr) => DivineHandler(input, attr).search('skill'))

Commander.register({
  command: 'npc',
  input: true
}, (input, attr) => DivineHandler(input, attr).search('npc'))

Commander.register({
  command: 'quest',
  input: true
}, (input, attr) => DivineHandler(input, attr).search('quest'))

Commander.register({
  command: 'xp',
  input: true
}, (input, attr) => DivineHandler(input, attr).exp())

Commander.register({
  command: 'dp',
  input: false
}, (input, attr) => {
  if(attr.handler.type === 'discord') attr.handler.message("", discordHelp)
})

export default (api_key, handler) => {
  try {
    handler.on('message', (content, attr) => {
      Commander.handle(content, Object.assign({
        handler: handler,
        key: api_key
      }, attr))
    })
  } catch (e) {
    console.log('error: ' + e.message)
  }
}
