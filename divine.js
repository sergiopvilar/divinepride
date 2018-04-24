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

  fetch(callback) {

    var j = request.jar();
    var cookie = request.cookie('lang=pt');
    var url = `https://www.divine-pride.net/database/search?q=${encodeURIComponent(this.input)}`
    j.setCookie(cookie, url);

    request({ jar: j, url: url}, (error, response, body) => {
      this.$ = cheerio.load(body)
      callback()
    });
  }

  getFirst(type, callback) {
    this.fetch(() => {
      let matches = this.$(`#${type}`).find('table tbody tr')
        , choosen = false

      matches.map((index, el) => {
        if (this.$(el).find('a').text().toLowerCase() == this.input.toLowerCase()) choosen = this.$(el).find('a').attr('href')
      })

      if (!choosen) choosen = matches.eq(0).find('a').attr('href')

      callback(choosen)
    })
  }

  answer(res) {
    let url = `http://www.divine-pride.net${res}`

    if(_.isEmpty(res)) {
      this.message.reply("Não é possível encontrar um resultado para '" + this.input + "'.")
    } else {
      this.message.channel.send("Resultado da busca por '" + this.input + "': \n" + url)
    }
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
    let arr = res.split('/')

    if (_.isEmpty(res)) {
      this.message.reply("Não é possível encontrar um resultado para '" + this.input + "'.")
      return
    }

    this.api.fetch(arr[2], arr[3], (obj) => {
      let message = ''
      message += "" + obj.name + "\n"
      message += `http://www.divine-pride.net${res}\n`
      message += "```\n"
      message += this.fixDescription(obj.description) + "\n"
      message += "```\n"
      this.message.channel.send(message)
    })

  }

  answerMonster(res) {
    let arr = res.split('/')
    let elements = ['Neutro', 'Água', 'Terra', 'Fogo', 'Vento', 'Veneno', 'Sagrado', 'Sombrio', 'Fantasma', 'Maldito']

    if (_.isEmpty(res)) {
      this.message.reply("Não é possível encontrar um resultado para '" + this.input + "'.")
      return
    }

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
    console.log(type)
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
