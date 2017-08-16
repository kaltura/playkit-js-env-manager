#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require('chalk');
const config = require("../repos.json");
const repo = require("../repo");
const main = "kaltura-player-js";
const keys =
    Object.keys(config)
        .filter(function (key) {
            return config[key]['debug'].link === true;
        });


shell.config.silent = true;
shell.exec("clear");
console.log(chalk.bold.bgRed("Stopping Debugging Mode"));

(function () {
    keys.forEach(function (key) {
        console.log(chalk.dim("################################################"));
        console.log(chalk.bold("Working on: ") + chalk.underline.italic.cyan(key));
        repo.init(key);
        repo.stop();
    });

    console.log(chalk.dim("################################################"));
    console.log(chalk.bold("Working on: ") + chalk.underline.italic.cyan(main));

    shell.cd("../" + main);

    try {
        const contents = JSON.parse(shell.head({'-n': 1000000}, ['package.json']));
        const dependencies = contents['dependencies'];
        keys.forEach(function (key) {
            console.log(chalk.bold.underline.magenta("unlink " + chalk.italic(key)));
            shell.exec("yarn unlink " + key);
            console.log(chalk.bold.green("✔ Done"));
            console.log(chalk.bold.underline.magenta("yarn add " + chalk.italic(key)));
            shell.exec("npm install " + dependencies[key]);
            console.log(chalk.bold.green("✔ Done"));
        });
    }
    catch (e) {
        console.log(chalk.bold.red("✘ " + e.message + " ✘"));
    }

    console.log(chalk.bold.magenta("✘ kill all node processes ✘"));
    shell.exec("killall node");
})();
