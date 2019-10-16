import request from 'request';

export default class API {

  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  fetch(type, id, callback) {
    const url = `https://www.divine-pride.net/api/database/${type}/${id}?apiKey=${this.apiKey}&server=bRO`;

    request(url, (error, response, body) => {
      try {
        callback(JSON.parse(body));
      } catch (exception) {
        callback(false);
      }
    });
  }

  item(id, callback) {
    this.fetch('item', id, callback);
  }
}
