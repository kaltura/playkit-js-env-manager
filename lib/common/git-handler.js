#! /usr/bin/env node
const chalk = require("chalk");
const shell = require("shelljs");
const Utils = require("./utils");

class GitHandler {
  static fetchTags() {
    Utils.print(chalk.bold.underline.blue("- fetch tags"));
    shell.exec("git fetch --tags");
    Utils.printDone();
  }

  static stashChanges() {
    Utils.print(chalk.bold.underline.blue("- stash changes"));
    shell.exec("git stash");
    Utils.printDone();
  }

  static checkoutMaster() {
    shell.exec("git pull");
    Utils.print(chalk.bold.underline.blue("- checkout master"));
    shell.exec("git checkout master");
    Utils.printDone();
    Utils.print(chalk.bold.underline.blue("- pull origin master"));
    shell.exec("git pull origin master");
    Utils.printDone();
  }

  static checkoutVersion(version) {
    Utils.print(chalk.bold.underline.blue("- fetch tags"));
    shell.exec("git fetch --all --tags --prune");
    Utils.printDone();
    Utils.print(chalk.bold.underline.blue("- checkout tag " + version));
    shell.exec("git checkout tags/" + version);
    Utils.printDone();
  }

  static commit(commitMsg, displayMsg) {
    Utils.print(chalk.bold.underline.blue("- commit " + displayMsg + " changes"));
    shell.exec("git commit -m '" + commitMsg + "'");
    Utils.printDone();
  }

  static add(files) {
    files.forEach((file) => {
      Utils.print(chalk.bold.underline.blue("- add " + file + " to changelist"));
      shell.exec("git add " + file);
      Utils.printDone();
    });
  }

  static addAndCommit(file, commitMsg) {
    Utils.print(chalk.bold.underline.blue("- commit " + file + " changes"));
    shell.exec("git add " + file);
    shell.exec("git commit -m '" + commitMsg + "'");
    Utils.printDone();
  }

  static resetHardMaster() {
    Utils.print(chalk.bold.underline.blue("- reset hard"));
    shell.exec("git reset --hard origin/master");
    Utils.printDone();
  }

  static deleteLocalTag(tag) {
    Utils.print(chalk.bold.underline.blue("- delete local tag"));
    shell.exec("git tag -d v" + tag);
    Utils.printDone();
  }
}

module.exports = GitHandler;
