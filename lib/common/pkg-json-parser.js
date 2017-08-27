#! /usr/bin/env node
const parser = require('json-parser');
const fs = require('fs');

module.exports = {
  parse: function (prop) {
    let content = fs.readFileSync('package.json', {encoding: 'utf-8'});
    let object = parser.parse(content);
    return prop ? object[prop] : object;
  }
};
