#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const config = require("../playkit-repos.json");
const utils = require("../utils");
const constants = require("../constants");
const playkitRepo = require("../playkit-repo");
const kalturaPlayerRepo = require("../kaltura-player-repo");
const keys = Object.keys(config);

(function () {
    shell.config.silent = true;
    shell.exec("clear");
    printInfo();
    handlePlaykitRepos();
    handleKalturaPlayerRepo();
    utils.print(chalk.bold.magenta("✘ killing all node processes ✘"));
    shell.exec("killall node");
})();

function printInfo() {
    utils.print(chalk.bold.bgRed(constants.STOP_DEV_MODE));
}

function handlePlaykitRepos() {
    keys.forEach(function (key) {
        utils.printSeparator();
        utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.italic.cyan(key));
        playkitRepo.init(key);
        playkitRepo.stopDevMode();
    });
}

function handleKalturaPlayerRepo() {
    utils.printSeparator();
    utils.print(chalk.bold(constants.WORKING_ON) + chalk.underline.italic.cyan(constants.KALTURA_PLAYER_JS));
    kalturaPlayerRepo.init();
    kalturaPlayerRepo.stopDevMode();
}