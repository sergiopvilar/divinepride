import request from 'request';
import cheerio from 'cheerio';
import _ from 'underscore';
import Api from './api.js';

export default class DivinePride {

  constructor(input, apiKey) {
    this.api = new Api(apiKey);
    this.input = input;
    this.callbacks = {reply: [], message: []};
  }

  on(event, callback) {
    this.callbacks[event].push(callback);
  }

  trigger(event, message) {
    this.callbacks[event].map((callback) => callback(message));
  }

  fetch(callback, input = this.input) {

    const j = request.jar();
    const cookie = request.cookie('lang=pt');
    const url = `https://www.divine-pride.net/database/search?q=${encodeURIComponent(input)}`;
    j.setCookie(cookie, url);

    request({jar: j, url}, (error, response, body) => {
      this.$ = cheerio.load(body);
      callback();
    });
  }

  getFirst(type, callback, input = this.input) {
    this.fetch(() => {
      const matches = this.$(`#${type}`).find('table tbody tr');
      let choosen = false;
      let first;
      let counter = 0;
      let itemName;
      let itemLowerCase;

      matches.forEach((el) => {
        itemName = this.$(el).find('a').text()
                                       .toLowerCase();

        if (counter === 0) {
          first = this.$(el).find('a').attr('href');
        }
        counter++;
        if (itemName === input.toLowerCase()) {
          choosen = this.$(el).find('a').attr('href');
        }
      });

      if (!choosen) {
        matches.forEach((el) => {
          itemLowerCase = this.$(el).find('a').text()
                                              .toLowerCase()
                                              .indexOf(input.toLowerCase());
          if (itemLowerCase > -1) {
            choosen = this.$(el).find('a').attr('href');
          }
        });
      }

      if (!choosen) {
        choosen = first;
      }

      callback(choosen);
    }, input);
  }

  answer(res) {
    const url = `http://www.divine-pride.net${res}`;

    if (_.isEmpty(res)) {
      this.trigger('reply', `Não é possível encontrar um resultado para '${this.input}'.`);
    } else {
      this.trigger('message', `Resultado da busca por '${this.input}': \n${url}`);
    }
  }

  expMultiplier(monsterLevel, baseLevel) {
    let modifier = 0;
    const levelDiff = monsterLevel - baseLevel;

    if (levelDiff > 15) {
      modifier = 0.4;
    } else if (levelDiff <= 15 && levelDiff >= 10) {
      modifier = (140 - ((levelDiff - 10) * 5)) / 100;
    } else if (levelDiff <= 9 && levelDiff >= 3) {
      modifier = (140 - ((10 - levelDiff) * 5)) / 100;
    } else if (levelDiff <= 2 && levelDiff >= -5) {
      modifier = 1;
    } else if (levelDiff <= -6 && levelDiff >= -10) {
      modifier = 0.95;
    } else if (levelDiff <= -12 && levelDiff >= -15) {
      modifier = 0.9;
    } else if (levelDiff <= -16 && levelDiff >= -20) {
      modifier = 0.85;
    } else if (levelDiff <= -21 && levelDiff >= -25) {
      modifier = 0.6;
    } else if (levelDiff <= -26 && levelDiff >= -30) {
      modifier = 0.35;
    } else {
      modifier = 0.1;
    }

    return modifier;
  }

  exp(markup = true) {
    const levels = _.last(this.input.split(' '));
    const monster = this.input.replace(_.last(this.input.split(' ')), '').trim();
    const levelBase = parseInt(_.first(levels.split('/')), 10);
    let arr;
    let modifier;
    let message = '';

    this.getFirst('monster', (res) => {

      if (_.isEmpty(res)) {
        this.trigger('reply', `Não é possível encontrar um resultado para '${monster}'.`);
        return;
      }

      arr = res.split('/');
      this.api.fetch('Monster', arr[3], (obj) => {
        modifier = this.expMultiplier(obj.stats.level, levelBase);

        message += `${obj.name}\n`;
        message += `http://www.divine-pride.net${res}\n`;
        if (markup) {
          message += "```\n";
        }
        message += `Base XP: ${Math.round(obj.stats.baseExperience * modifier)} (${Math.round(modifier * 100)}%)\n`;
        message += `Job XP: ${Math.round(obj.stats.jobExperience * modifier)} (${Math.round(modifier * 100)}%)\n`;
        if (markup) {
          message += "```\n";
        }

        this.trigger('message', message);
      });
    }, monster);
  }

  fixDescription(description) {
    let hex;
    let desc = description.replace("\n", "");

    desc = desc.replace('^ffffff_^000000', '');
    desc = desc.replace('^FFFFFF ^000000', '');
    desc = desc.replace('^FFFFFF  ^000000', '');
    desc = desc.replace('^FFFFFF  ^000000', '');
    desc = desc.replace(/\^FFFFFF/g, '');
    desc = desc.replace(/\^ffffff/g, '');
    desc = desc.replace(/\^000000/g, '');
    desc = desc.replace(/\^00000/g, '');

    while (desc.indexOf('^') > -1) {
      hex = desc.substring(desc.indexOf('^') + 1, desc.indexOf('^') + 7);
      desc = desc.replace(`^${hex}`, '');
    }

    return desc;
  }

  answerDescription(res, markup) {
    if (_.isEmpty(res)) {
      return this.trigger('reply', `Não é possível encontrar um resultado para '${this.input}'.`);
    }

    const arr = res.split('/');

    return this.api.fetch(arr[2], arr[3], (obj) => {
      let message = '';

      if (!obj) {
        return this.trigger('reply', `Não é possível encontrar um resultado para '${this.input}'.`);
      }

      message += `${obj.name}\n`;
      message += `http://www.divine-pride.net${res}\n`;

      if (markup) {
        message += "```\n";
        message += `${this.fixDescription(obj.description)}\n`;
        message += "```\n";
      }

      this.trigger('message', message);
      return message;
    });

  }

  answerMonster(res, markup) {
    const elements = ['Neutro', 'Água', 'Terra', 'Fogo', 'Vento', 'Veneno', 'Sagrado', 'Sombrio', 'Fantasma', 'Maldito'];

    if (_.isEmpty(res)) {
      this.trigger('reply', `não consigo achar nada para '${this.input}', por favor seja mais específico.`);
      return;
    }

    const arr = res.split('/');

    this.api.fetch('Monster', arr[3], (obj) => {
      let message = '';
      let vulnerabilities = [];

      if (!obj) {
        return;
      }

      _.each(obj.propertyTable, (value, key) => {
        if (value > 100) {
          vulnerabilities.push({value, element: `${elements[parseInt(key, 10)]}`});
        }
      });

      vulnerabilities.sort((prev, next) => next.value - prev.value);
      vulnerabilities = vulnerabilities.map((item) => `${item.element}(${item.value}%)`);

      message += `${obj.name}\n`;
      message += `http://www.divine-pride.net${res}`;
      if (markup) {
        message += "\n```\n";
        message += `Nível: ${obj.stats.level}\n`;
        message += `HP: ${obj.stats.health}\n`;
        message += `Precisão: ${obj.stats.hit}\n`;
        if (vulnerabilities.length > 0) {
          message += `Vulnerabilidades: ${vulnerabilities.join(', ')}`;
        }

        message += "```\n";
      }

      this.trigger('message', message);
    });
  }

  search(type, markup = true) {
    if (type === 'items') {
      this.getFirst(type, (res) => this.answerDescription(res, markup));
    } else if (type === 'monster') {
      this.getFirst(type, (res) => this.answerMonster(res, markup));
    } else {
      this.getFirst(type, (res) => this.answer(res));
    }
  }

}
