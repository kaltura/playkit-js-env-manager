#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const constants = require("./constants");
const utils = require("./utils");
const config = require("../playkit-repos.json");

let _repo;
let _version;
let _watch;
let _link;

module.exports = {
  init(repo) {
    _repo = repo;
    shell.cd("../" + _repo);
  },
  startDevMode() {
    configureDevMode(config[_repo][constants.DEV_MODE]);
    startDevMode();
  },
  stopDevMode() {
    configureDevMode(config[_repo][constants.DEV_MODE]);
    stopDevMode();
  }
};

function configureDevMode(config) {
  _version = config[constants.VERSION] || constants.LATEST;
  _watch = config[constants.WATCH] || false;
  _link = config[constants.LINK] || false;
}

function stashChanges() {
  utils.print(chalk.bold.underline.blue("- stash changes"));
  shell.exec("git stash");
  utils.printDone();
}

function checkoutMaster() {
  utils.print(chalk.bold.underline.blue("- checkout master"));
  shell.exec("git checkout master");
  utils.printDone();
  utils.print(chalk.bold.underline.blue("- pull origin master"));
  shell.exec("git pull origin master");
  utils.printDone();
}

function checkoutVersion() {
  utils.print(chalk.bold.underline.blue("- fetch tags"));
  shell.exec("git fetch --all --tags --prune");
  utils.printDone();
  utils.print(chalk.bold.underline.blue("- checkout tag " + _version));
  shell.exec("git checkout tags/" + _version);
  utils.printDone();
}

function startDevMode() {
  cleanAndUnlink();
  if (_link) {
    if (_version === constants.LOCAL) {
      stayOnLocalBranch();
    } else {
      stashChanges();
      if (_version === constants.LATEST) {
        checkoutMaster();
      } else if (_version === constants.VERSION)
        checkoutVersion();
    }
    buildAndLink();
    if (_watch) {
      watch();
    }
  } else {
    utils.printNoAction();
  }
}

function stopDevMode() {
  if (_link) {
    cleanAndUnlink();
  } else {
    utils.printNoAction();
  }
}

function buildAndLink() {
  utils.print(chalk.bold.underline.blue("- build project"));
  shell.exec("npm run build");
  utils.printDone();
  utils.print(chalk.bold.underline.blue("- link package"));
  shell.exec("yarn link");
  utils.printDone();
}

function stayOnLocalBranch() {
  utils.print(chalk.bold.underline.blue("- staying on local branch"));
  utils.printDone();
}

function cleanAndUnlink() {
  utils.print(chalk.bold.underline.magenta("- clean dist"));
  shell.exec("npm run clean");
  utils.printDone();
  utils.print(chalk.bold.underline.magenta("- unlink package"));
  shell.exec("yarn unlink");
  utils.printDone();
}

function watch() {
  utils.print(chalk.bold.dim("start dev-mode server in new tab ( ͡° ͜ʖ ͡°)"));
  shell.exec("ttab -t ◉_◉" + _repo + "◉_◉ -G exec npm run dev")
}
