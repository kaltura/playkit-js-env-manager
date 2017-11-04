#! /usr/bin/env node
const chalk = require("chalk");
const shell = require("shelljs");
const Utils = require("./utils");

class GitHandler {
  static fetchTags() {
    Utils.printGit("fetch tags");
    shell.exec("git fetch --tags");
    Utils.printDone();
  }

  static stashChanges() {
    Utils.printGit("stash changes");
    shell.exec("git stash");
    Utils.printDone();
  }

  static checkoutBranch(branch) {
    shell.exec("git pull");
    Utils.printGit("checkout branch " + branch);
    shell.exec("git checkout " + branch);
    Utils.printDone();
    Utils.printGit("pull origin " + branch);
    shell.exec("git pull origin " + branch);
    Utils.printDone();
  }

  static checkoutMaster() {
    shell.exec("git pull");
    Utils.printGit("checkout master");
    shell.exec("git checkout master");
    Utils.printDone();
    Utils.printGit("pull origin master");
    shell.exec("git pull origin master");
    Utils.printDone();
  }

  static checkoutVersion(version) {
    Utils.printGit("fetch tags");
    shell.exec("git fetch --all --tags --prune");
    Utils.printDone();
    Utils.printGit("checkout tag " + version);
    shell.exec("git checkout tags/" + version);
    Utils.printDone();
  }

  static commit(commitMsg, displayMsg) {
    Utils.printGit("commit " + displayMsg + " changes");
    shell.exec("git commit -m '" + commitMsg + "'");
    Utils.printDone();
  }

  static add(files) {
    files.forEach((file) => {
      Utils.printGit("add " + file + " to changelist");
      shell.exec("git add " + file);
      Utils.printDone();
    });
  }

  static resetHardMaster() {
    Utils.printGit("reset hard");
    shell.exec("git reset --hard origin/master");
    Utils.printDone();
  }

  static deleteLocalTag(tag) {
    Utils.printGit("delete local tag v" + tag);
    shell.exec("git tag -d v" + tag);
    Utils.printDone();
  }
}

module.exports = GitHandler;
