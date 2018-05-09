const request = require('request')

class API {

  fetch(type, id, callback) {
    const url = `https://www.divine-pride.net/api/database/${type}/${id}?apiKey=${process.env.API_KEY}&server=bRO`

    request(url, (error, response, body) => {
      try {
        callback(JSON.parse(body))
      } catch(e) {
        callback(false)
      }
    });
  }

  item(id, callback) {
    this.fetch('item', id, callback)
  }

}

module.exports = API
