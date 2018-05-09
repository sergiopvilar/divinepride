const request = require('request')
const cheerio = require('cheerio')
const _ = require('underscore')
const Api = require('./api')

class DivinePride {

  constructor(input, message) {
    this.api = new Api()
    this.input = input
    this.message = message
  }

  fetch(callback, input = this.input) {

    var j = request.jar();
    var cookie = request.cookie('lang=pt');
    var url = `https://www.divine-pride.net/database/search?q=${encodeURIComponent(input)}`
    j.setCookie(cookie, url);

    request({ jar: j, url: url}, (error, response, body) => {
      this.$ = cheerio.load(body)
      callback()
    });
  }

  getFirst(type, callback, input = this.input) {
    this.fetch(() => {
      let matches = this.$(`#${type}`).find('table tbody tr')
        , choosen = false
        , first
        , counter = 0

      matches.map((index, el) => {
        if (counter == 0) first = this.$(el).find('a').attr('href')
        counter++
        if (this.$(el).find('a').text().toLowerCase() == input.toLowerCase()) choosen = this.$(el).find('a').attr('href')
      })

      if(!choosen)
        matches.map((index, el) => {
          if (this.$(el).find('a').text().toLowerCase().indexOf(input.toLowerCase()) > -1) choosen = this.$(el).find('a').attr('href')
        })

      if (!choosen) choosen = first

      callback(choosen)
    }, input)
  }

  answer(res) {
    let url = `http://www.divine-pride.net${res}`

    if(_.isEmpty(res)) {
      this.message.reply("Não é possível encontrar um resultado para '" + this.input + "'.")
    } else {
      this.message.channel.send("Resultado da busca por '" + this.input + "': \n" + url)
    }
  }

  expMultiplier(monsterLevel, baseLevel) {
    let modifier = 0
      , levelDiff = monsterLevel - baseLevel

    console.log(monsterLevel, baseLevel)

    if(levelDiff > 15) {
      modifier = 0.4
    } else if (levelDiff <= 15 && levelDiff >= 10) {
      modifier = (140 - ((levelDiff - 10)*5))/100
    } else if(levelDiff <= 9 && levelDiff >= 3) {
      modifier = (140 - ((10 - levelDiff) * 5))/100
    } else if (levelDiff <= 2 && levelDiff >= -5) {
      modifier = 1
    } else if(levelDiff <= -6 && levelDiff >= -10) {
      modifier = 0.95
    } else if (levelDiff <= -12 && levelDiff >= -15) {
      modifier = 0.9
    } else if (levelDiff <= -16 && levelDiff >= -20) {
      modifier = 0.85
    } else if (levelDiff <= -21 && levelDiff >= -25) {
      modifier = 0.6
    } else if (levelDiff <= -26 && levelDiff >= -30) {
      modifier = 0.35
    } else {
      modifier = 0.1
    }

    return modifier
  }

  exp() {
    let levels = _.last(this.input.split(' '))
      , monster = this.input.replace(_.last(this.input.split(' ')), '').trim()
      , levelBase = parseInt(_.first(levels.split('/')))
      , arr
      , modifier
      , message = ''

    this.getFirst('monster', (res) => {

      if (_.isEmpty(res)) {
        this.message.reply("Não é possível encontrar um resultado para '" + monster + "'.")
        return
      }

      arr = res.split('/')
      this.api.fetch('Monster', arr[3], (obj) => {
        modifier = this.expMultiplier(obj.stats.level, levelBase)

        message += "" + obj.name + "\n"
        message += `http://www.divine-pride.net${res}\n`
        message += "```\n"
        message += `Base XP: ${Math.round(obj.stats.baseExperience * modifier)} (${Math.round(modifier * 100)}%)\n`
        message += `Job XP: ${Math.round(obj.stats.jobExperience * modifier)} (${Math.round(modifier * 100)}%)\n`
        message += "```\n"

        this.message.channel.send(message)
      })
    }, monster)
  }

  fixDescription(desc) {
    desc = desc.replace("\n", "")
    // desc = desc.replace(/\'/g, "'")
    desc = desc.replace('^ffffff_^000000', '')
    desc = desc.replace('^FFFFFF ^000000', '')
    desc = desc.replace('^FFFFFF  ^000000', '')
    desc = desc.replace('^FFFFFF  ^000000', '')
    desc = desc.replace(/\^FFFFFF/g, '')
    desc = desc.replace(/\^ffffff/g, '')
    desc = desc.replace(/\^000000/g, '')
    desc = desc.replace(/\^00000/g, '')

    while (desc.indexOf('^') > -1) {
      let hex = desc.substring(desc.indexOf('^') + 1, desc.indexOf('^') + 7);
      desc = desc.replace('^' + hex, '')
    }

    return desc
  }

  answerDescription(res) {
    let arr

    if (_.isEmpty(res)) return this.message.reply("Não é possível encontrar um resultado para '" + this.input + "'.")

    arr = res.split('/')

    this.api.fetch(arr[2], arr[3], (obj) => {
      let message = ''

      if (!obj) return this.message.reply("Não é possível encontrar um resultado para '" + this.input + "'.")

      message += "" + obj.name + "\n"
      message += `http://www.divine-pride.net${res}\n`
      message += "```\n"
      message += this.fixDescription(obj.description) + "\n"
      message += "```\n"
      this.message.channel.send(message)
    })

  }

  answerMonster(res) {
    let arr
    let elements = ['Neutro', 'Água', 'Terra', 'Fogo', 'Vento', 'Veneno', 'Sagrado', 'Sombrio', 'Fantasma', 'Maldito']

    if (_.isEmpty(res)) {
      this.message.reply("não consigo achar nada para '" + this.input + "', por favor seja mais específico.")
      return
    }

    arr = res.split('/')

    this.api.fetch('Monster', arr[3], (obj) => {
      let message = ''
      let vulnerabilities = []

      _.each(obj.propertyTable, (value, key) => {
        if(value > 100) vulnerabilities.push({value: value, element: `${elements[parseInt(key)]}`})
      })

      vulnerabilities.sort((a, b) => b.value - a.value)
      vulnerabilities = vulnerabilities.map((item) => `${item.element}(${item.value}%)`)

      message += "" + obj.name + "\n"
      message += `http://www.divine-pride.net${res}\n`
      message += "```\n"
      message += `Nível: ${obj.stats.level}\n`
      message += `HP: ${obj.stats.health}\n`
      message += `Precisão: ${obj.stats.hit}\n`

      if (vulnerabilities.length > 0)
        message += `Vulnerabilidades: ${vulnerabilities.join(', ')}`

      message += "```\n"

      this.message.channel.send(message)
    })
  }

  search(type) {
    if(type === 'items'){
      this.getFirst(type, (res) => this.answerDescription(res))
    } else if(type == 'monster') {
      this.getFirst(type, (res) => this.answerMonster(res))
    } else {
      this.getFirst(type, (res) => this.answer(res))
    }
  }

}

module.exports = DivinePride
