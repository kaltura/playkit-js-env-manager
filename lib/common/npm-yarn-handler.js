#! /usr/bin/env node
const chalk = require("chalk");
const shell = require("shelljs");
const Utils = require("./utils");
const constants = require("./constants");

class NpmYarnHandler {
  static watch(repo) {
    Utils.print(chalk.bold.magenta("- start dev server in new tab ( ͡° ͜ʖ ͡°)"));
    shell.exec("ttab -t ◉_◉" + repo + "◉_◉ -G exec npm run dev")
  }

  static dev(repo) {
    Utils.print(chalk.bold.magenta("- start dev server in new tab  ( ͡° ͜ʖ ͡°)"));
    shell.exec("ttab -t ◉_◉" + repo + "◉_◉ -G npm run start");
  }

  static clean() {
    Utils.print(chalk.bold.underline.magenta("- clean dist"));
    shell.exec("npm run clean");
    Utils.printDone();
  }

  static unlink() {
    Utils.print(chalk.bold.underline.magenta("- unlink package"));
    shell.exec("yarn unlink");
    Utils.printDone();
  }

  static unlinkAndAddRepo(key, path) {
    NpmYarnHandler.unlink(key);
    NpmYarnHandler.add(path);
  }

  static unlinkRepo(key) {
    Utils.print(chalk.bold.underline.magenta("- unlink " + chalk.italic(key)));
    shell.exec("yarn unlink " + key);
    Utils.printDone();
  }

  static add(path) {
    Utils.print(chalk.bold.underline.magenta("- yarn add " + chalk.italic(key)));
    shell.exec("yarn add " + path);
    Utils.printDone();
  }

  static cleanAndUnlink() {
    NpmYarnHandler.clean();
    NpmYarnHandler.unlink();
  }

  static build() {
    Utils.print(chalk.bold.underline.magenta("- build project"));
    shell.exec("npm run build");
    Utils.printDone();
  }

  static linkRepo(key) {
    Utils.print(chalk.bold.underline.magenta("- link " + chalk.italic(key)));
    shell.exec("yarn link " + key);
    Utils.printDone();
  }

  static upgrade(key, path) {
    Utils.print(chalk.bold.underline.magenta("- upgrade " + chalk.italic(key)));
    shell.exec("yarn upgrade " + path);
    Utils.printDone();
  }

  static link() {
    Utils.print(chalk.bold.underline.magenta("- link package"));
    shell.exec("yarn link");
    Utils.printDone();
  }

  static buildAndLink() {
    NpmYarnHandler.build();
    NpmYarnHandler.link();
  }

  static release() {
    Utils.print(chalk.bold.underline.magenta("- release (using standard-version)"));
    shell.exec("npm run release");
    Utils.printDone();
  }

  static publish() {
    Utils.print(chalk.bold.underline.magenta("- publish"));
    shell.exec("npm run publish");
    Utils.printDone();
  }
}

module.exports = NpmYarnHandler;
