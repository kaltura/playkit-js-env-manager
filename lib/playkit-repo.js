#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const constants = require("./constants");
const utils = require("./utils");
const config = require("./playkit-repos.json");

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

function stashChangesIfNeeded() {
    utils.print(chalk.bold.underline.blue("1. stash changes"));
    shell.exec("git stash");
    utils.printDone();
}

function checkoutMaster() {
    utils.print(chalk.bold.underline.blue("2. checkout master"));
    shell.exec("git checkout master");
    utils.printDone();
    utils.print(chalk.bold.underline.blue("3. pull origin master"));
    shell.exec("git pull origin master");
    utils.printDone();
}

function checkoutVersion() {
    utils.print(chalk.bold.underline.blue("2. fetch tags"));
    shell.exec("git fetch --all --tags --prune");
    utils.printDone();
    utils.print(chalk.bold.underline.blue("3. checkout tag " + _version));
    shell.exec("git checkout tags/" + _version);
    utils.printDone();
}

function startDevMode() {
    if (_link) {
        stashChangesIfNeeded();
        if (_version === constants.LATEST) {
            checkoutMaster();
        } else {
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
    utils.print(chalk.bold.underline.blue("4. build project"));
    shell.exec("npm run build");
    utils.printDone();
    utils.print(chalk.bold.underline.blue("5. link package"));
    shell.exec("yarn link");
    utils.printDone();
}

function cleanAndUnlink() {
    utils.print(chalk.bold.underline.magenta("1. clean dist"));
    shell.exec("npm run clean");
    utils.printDone();
    utils.print(chalk.bold.underline.magenta("2. unlink package"));
    shell.exec("yarn unlink");
    utils.printDone();
}

function watch() {
    utils.print(chalk.bold.dim("start dev-mode server in new tab ( ͡° ͜ʖ ͡°)"));
    shell.exec("ttab -t ◉_◉" + _repo + "◉_◉ -G exec npm run dev")
}
