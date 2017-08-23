#! /usr/bin/env node
const chalk = require("chalk");

module.exports = {
  printDone: function () {
    console.log(chalk.bold.green("✔ Done"));
  },
  printNoAction() {
    console.log(chalk.bold.green("✔ No additional actions needs to be done"));
  },
  printSeparator: function () {
    console.log(chalk.dim("################################################"));
  },
  print(s) {
    console.log(s);
  }
};
