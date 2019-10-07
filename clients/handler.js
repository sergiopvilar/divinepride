import Events from 'events'

export default class Handler extends Events {

  constructor() {
    this.connect();
    this.listen();
  }

  connect() {
    throw new Error('Method must be implemented!')
  }

  listen() {
    throw new Error('Method must be implemented!')
  }

  reply() {
    throw new Error('Method must be implemented!')
  }

  message() {
    throw new Error('Method must be implemented!')
  }
}
