#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");

let _repo;
let _version;
let _watch;

module.exports = {
    init(repo) {
        _repo = repo;
    },
    configure(config) {
        _version = config.version || 'latest';
        _watch = config.watch || false;
        shell.cd("../" + _repo);
        console.log(chalk.bold.underline.blue("1. stash changes"));
        shell.exec("git stash");
        console.log(chalk.bold.green("✔ Done"));
        if (_version === 'latest') {
            console.log(chalk.bold.underline.blue("2. checkout master"));
            shell.exec("git checkout master");
            console.log(chalk.bold.green("✔ Done"));
            console.log(chalk.bold.underline.blue("3. pull origin master"));
            shell.exec("git pull origin master");
            console.log(chalk.bold.green("✔ Done"));
        } else {
            console.log(chalk.bold.underline.blue("2. fetch tags"));
            shell.exec("git fetch --all --tags --prune");
            console.log(chalk.bold.green("✔ Done"));
            console.log(chalk.bold.underline.blue("3. checkout tag " + _version));
            shell.exec("git checkout tags/" + _version);
            console.log(chalk.bold.green("✔ Done"));
        }
    },
    start() {
        shell.cd("../" + _repo);
        console.log(chalk.bold.underline.blue("4. build project"));
        shell.exec("npm run build");
        console.log(chalk.bold.green("✔ Done"));
        console.log(chalk.bold.underline.blue("5. link package"));
        shell.exec("yarn link");
        console.log(chalk.bold.green("✔ Done"));
        if (_watch) {
            console.log(chalk.bold.dim("start dev server in new tab ( ͡° ͜ʖ ͡°)"));
            shell.exec("ttab -t ◉_◉" + _repo + "◉_◉ -G exec npm run dev")
        }
    },
    stop() {
        shell.cd("../" + _repo);
        console.log(chalk.bold.underline.magenta("1. clean dist"));
        shell.exec("npm run clean");
        console.log(chalk.bold.green("✔ Done"));
        console.log(chalk.bold.underline.magenta("2. unlink package"));
        shell.exec("yarn unlink");
        console.log(chalk.bold.green("✔ Done"));
    }
};

