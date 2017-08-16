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
console.log(chalk.bold.bgGreen("Starting Debugging Mode"));
console.log(chalk.dim("################################################"));

(function () {
    console.log(chalk.bold("Building debug for configuration:"));
    console.log(chalk.italic(JSON.stringify(config, null, 2)));

    keys.forEach(function (key) {
        console.log(chalk.dim("################################################"));
        console.log(chalk.bold("Working on: ") + chalk.underline.cyan.italic(key));
        repo.init(key);
        repo.configure(config[key]['debug']);
        repo.start();
    });

    console.log(chalk.dim("################################################"));
    console.log(chalk.bold("Working on: ") + chalk.underline.cyan.italic(main));

    shell.cd("../" + main);

    keys.forEach(function (key) {
        console.log(chalk.bold.underline.blue("link " + chalk.italic(key)));
        shell.exec("yarn link " + key);
        console.log(chalk.bold.green("✔ Done"));
    });

    console.log(chalk.bold.dim("start dev server in new tab  ( ͡° ͜ʖ ͡°)"));
    shell.exec("ttab -t ◉_◉" + main + "◉_◉ -G npm run start");
})();