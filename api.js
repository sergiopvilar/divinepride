const request = require('request')

class API {

  fetch(type, id, callback) {
    const url = `https://www.divine-pride.net/api/database/${type}/${id}?server=bRO&apiKey=${process.env.API_KEY}`
    request(url, (error, response, body) => {
      callback(JSON.parse(body))
    });
  }

  item(id, callback) {
    this.fetch('item', id, callback)
  }

}

module.exports = API
