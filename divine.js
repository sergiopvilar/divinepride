const request = require('request')
const cheerio = require('cheerio')
const _ = require('underscore')

class DivinePride {

  constructor(input, message) {
    this.input = input
    this.message = message
  }

  fetch(callback) {

    var j = request.jar();
    var cookie = request.cookie('lang=pt');
    var url = `https://www.divine-pride.net/database/search?q=${this.input}`
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

  item() {
    this.getFirst('items', (res) => this.answer(res))
  }

  mob() {
    this.getFirst('monster', (res) => this.answer(res))
  }

  map() {
    this.getFirst('map', (res) => this.answer(res))
  }

  quest() {
    this.getFirst('quest', (res) => this.answer(res))
  }

  skill() {
    this.getFirst('skill', (res) => this.answer(res))
  }

  npc() {
    this.getFirst('npc', (res) => this.answer(res))
  }

}

module.exports = DivinePride