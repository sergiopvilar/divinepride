import ChatbotCommander from 'chatbot-commander';
import discordHelp from '../discordHelp.js';
import DivinePride from '../divine/divine.js';

const Commander = new ChatbotCommander();
const searches = ['map', 'skill', 'npc', 'quest'];

function DivineHandler(input, attr) {
  let dp;

  try {
    dp = new DivinePride(input, attr.key);
    dp.on('message', (txt) => attr.handler.message(txt, attr));
    dp.on('reply', (txt) => attr.handler.reply(txt, attr));
  } catch (exception) {
    console.log(`error: ${exception.message}`);
    attr.handler.reply('houve um erro com sua requisição.', attr);
  }

  return dp;
}

searches.forEach((search) => {
  Commander.register({
    command: search,
    input: true,
  }, (input, attr) => DivineHandler(input, attr).search(search));
});

Commander.register({
  command: 'item',
  input: true,
}, (input, attr) => DivineHandler(input, attr).search('items'));

Commander.register({
  command: 'mob',
  input: true,
}, (input, attr) => DivineHandler(input, attr).search('monster'));

Commander.register({
  command: 'xp',
  input: true,
}, (input, attr) => DivineHandler(input, attr).exp());

Commander.register({
  command: 'dp',
  input: false,
}, (input, attr) => {
  if (attr.handler.type === 'discord') {
    attr.handler.message("", discordHelp);
  }
});

const client = (apiKey, handler) => {
  try {
    handler.on('message', (content, attr) => {
      Commander.handle(content, Object.assign(attr, {
        handler,
        key: apiKey,
      }));
    });
  } catch (exception) {
    console.log(`error: ${exception.message}`);
  }
};

export default client;
