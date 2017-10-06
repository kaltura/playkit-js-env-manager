#! /usr/bin/env node
const chalk = require("chalk");
const shell = require("shelljs");
const Utils = require("./utils");
const constants = require("./constants");

class NpmYarnHandler {
  static install() {
    Utils.printYarn("install packages");
    shell.exec("yarn");
    Utils.printDone();
  }

  static watch(repo) {
    Utils.printYarn("start dev server in new tab ( ͡° ͜ʖ ͡°)");
    shell.exec("ttab -t ◉_◉" + repo + "◉_◉ -G exec npm run dev")
  }

  static dev(repo) {
    Utils.printYarn("start dev server in new tab  ( ͡° ͜ʖ ͡°)");
    shell.exec("ttab -t ◉_◉" + repo + "◉_◉ -G npm run start");
  }

  static clean() {
    Utils.printYarn("clean dist");
    shell.exec("npm run clean");
    Utils.printDone();
  }

  static unlink() {
    Utils.printYarn("unlink package");
    shell.exec("yarn unlink");
    Utils.printDone();
  }

  static unlinkRepo(key) {
    Utils.printYarn("unlink " + chalk.italic(key));
    shell.exec("yarn unlink " + key);
    Utils.printDone();
  }

  static add(key, path) {
    Utils.printYarn("add " + chalk.italic(key));
    shell.exec("yarn add " + path);
    Utils.printDone();
  }

  static cleanAndUnlink() {
    NpmYarnHandler.clean();
    NpmYarnHandler.unlink();
  }

  static build() {
    Utils.printYarn("build project");
    shell.exec("npm run build");
    Utils.printDone();
  }

  static linkRepo(key) {
    Utils.printYarn("link " + chalk.italic(key));
    shell.exec("yarn link " + key);
    Utils.printDone();
  }

  static link() {
    Utils.printYarn("link package");
    shell.exec("yarn link");
    Utils.printDone();
  }

  static buildAndLink() {
    NpmYarnHandler.build();
    NpmYarnHandler.link();
  }

  static releaseDry() {
    Utils.printYarn("release dry-run (using standard-version)");
    shell.exec("npm run release:dry-run");
    Utils.printDone();
  }

  static release() {
    Utils.printYarn("release (using standard-version)");
    shell.exec("npm run release");
    Utils.printDone();
  }

  static publish() {
    Utils.printYarn("publish");
    shell.exec("npm run publish");
    Utils.printDone();
  }
}

module.exports = NpmYarnHandler;
