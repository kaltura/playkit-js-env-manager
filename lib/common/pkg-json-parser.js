#! /usr/bin/env node
const parser = require("json-parser");
const fs = require("fs");
const constants = require("./constants");

class PkgJsonParser {
  static parse(prop) {
    let content = fs.readFileSync(constants.PACKAGE_JSON, {encoding: constants.UTF_8});
    let object = parser.parse(content);
    return prop ? object[prop] : object;
  }
}

module.exports = PkgJsonParser;
