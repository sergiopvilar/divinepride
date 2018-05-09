require('dotenv').config()

const fs = require('fs')
const list = fs.readFileSync(__dirname + '/buyingstoreItemList.txt', 'utf-8')

let ids
let names = []
let counter = 0

ids = list.split("\n").filter((item) => {
  return parseInt(item.replace('#','')) > 0
}).map((item) => {
  return item.replace("\r", '').replace('#','')
})

module.exports = ids
