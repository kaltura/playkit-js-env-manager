#! /usr/bin/env node
const fs = require("fs");
const shell = require("shelljs");
const chalk = require("chalk");
const constants = require("../common/constants");
const Utils = require("../common/utils");
const PkgJsonParser = require("../common/pkg-json-parser");
const NpmYarnHandler = require("../common/npm-yarn-handler");
const GitHandler = require("../common/git-handler");
const ReleaseDataHandler = require("../common/release-data-handler");

class KalturaPlayerController {
  constructor(config, keys) {
    this.config = config;
    this.keys = keys;
  }

  startDevMode() {
    this.keys.forEach((key) => {
      if (this.config[key][constants.DEV_MODE][constants.LINK]) {
        NpmYarnHandler.linkRepo(key);
      }
    });
    NpmYarnHandler.dev(constants.KALTURA_PLAYER_JS);
  }

  stopDevMode() {
    try {
      const pkgJsonDependencies = PkgJsonParser.parse(constants.DEPENDENCIES);
      this.keys.forEach((key) => {
        if (this.config[key][constants.DEV_MODE][constants.LINK]) {
          NpmYarnHandler.unlinkRepo(key, pkgJsonDependencies[key]);
        }
      });
      NpmYarnHandler.build();
    }
    catch (e) {
      Utils.print(chalk.bold.red("✘ " + e.message + " ✘"));
    }
  }

  startReleaseMode() {
    GitHandler.stashChanges();
    GitHandler.checkoutMaster();
    updatePlaykitReposVersions.call(this);
    NpmYarnHandler.release();
    ReleaseDataHandler.set(constants.KALTURA_PLAYER_JS, {
      version: Utils.getNewVersion(),
      changeLog: Utils.getChangeLog()
    });
  }

  completeReleaseMode() {
    NpmYarnHandler.publish();
    // TODO: Copy release notes to GitHub repo
  }

  cancelReleaseMode() {
    GitHandler.resetHardMaster();
    GitHandler.deleteLocalTag();
  }
}

function updatePlaykitReposVersions() {
  let pkgContent = PkgJsonParser.parse();
  let releaseData = ReleaseDataHandler.get();
  Object.keys(releaseData).forEach((key) => {
    Utils.print(chalk.bold.underline.blue("- update " + chalk.italic(key) + " version to ") + chalk.yellow(releaseData[key].version));
    pkgContent[constants.DEPENDENCIES][key] = constants.REPO_URL_PREFIX + key + constants.REPO_URL_POSTFIX + releaseData[key].version;
    Utils.printDone();
  });
  Utils.print(chalk.bold.underline.blue("- commit package.json changes"));
  fs.writeFileSync(constants.PACKAGE_JSON, JSON.stringify(pkgContent, null, 2));
  shell.exec("git add package.json");
  shell.exec("git commit -m 'chore(package.json): update playkit-js-* versions'");
  Utils.printDone();
}

module.exports = KalturaPlayerController;
