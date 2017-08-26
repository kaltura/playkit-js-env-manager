#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const constants = require("./constants");
const utils = require("./utils");
const config = require("../playkit-repos.json");
const keys = Object.keys(config);

module.exports = {
  init() {
    shell.cd("../" + constants.KALTURA_PLAYER_JS);
  },
  startDevMode() {
    startDevMode();
  },
  stopDevMode() {
    stopDevMode();
  }
};

function startDevMode() {
  keys.forEach((key) => {
    if (config[key][constants.DEV_MODE][constants.LINK]) {
      linkRepo(key);
    }
  });
  dev();
}

function linkRepo(key) {
  utils.print(chalk.bold.underline.blue("link " + chalk.italic(key)));
  shell.exec("yarn link " + key);
  utils.printDone();
}

function dev() {
  utils.print(chalk.bold.dim("start dev-mode server in new tab  ( ͡° ͜ʖ ͡°)"));
  shell.exec("ttab -t ◉_◉" + constants.KALTURA_PLAYER_JS + "◉_◉ -G npm run start");
}

function stopDevMode() {
  try {
    const pkgJsonContent = JSON.parse(shell.head({'-n': constants.LINES}, [constants.PACKAGE_JSON]));
    const pkgJsonDependencies = pkgJsonContent[constants.DEPENDENCIES];
    keys.forEach(function (key) {
      if (config[key][constants.DEV_MODE][constants.LINK]) {
        unlinkRepo(key, pkgJsonDependencies[key]);
      }
    });
    utils.print(chalk.bold.underline.magenta("build " + constants.KALTURA_PLAYER_JS));
    shell.exec("npm run build");
    utils.printDone();
  }
  catch (e) {
    utils.print(chalk.bold.red("✘ " + e.message + " ✘"));
  }
}

function unlinkRepo(key, path) {
  utils.print(chalk.bold.underline.magenta("unlink " + chalk.italic(key)));
  shell.exec("yarn unlink " + key);
  utils.printDone();
  utils.print(chalk.bold.underline.magenta("yarn add " + chalk.italic(key)));
  shell.exec("yarn add " + path);
  utils.printDone();
}
