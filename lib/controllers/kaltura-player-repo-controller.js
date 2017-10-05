#! /usr/bin/env node
const fs = require("fs");
const chalk = require("chalk");
const constants = require("../common/constants");
const Utils = require("../common/utils");
const PkgJsonParser = require("../common/pkg-json-parser");
const NpmYarnHandler = require("../common/npm-yarn-handler");
const GitHandler = require("../common/git-handler");
const ReleaseDataHandler = require("../common/release-data-handler");
const PLAYKIT_REPO_LIST = require("../configuration/repo-list.json");

class KalturaPlayerController {
  constructor(playkits) {
    this.playkits = playkits;
  }

  startDevMode() {
    PLAYKIT_REPO_LIST.forEach((repoAlias) => {
      const playkit = this.playkits[repoAlias];
      if (playkit.include) {
        NpmYarnHandler.linkRepo(playkit.name);
      }
    });
    NpmYarnHandler.install();
    NpmYarnHandler.dev(constants.KALTURA_PLAYER_JS);
  }

  stopDevMode() {
    try {
      const pkgJsonDependencies = PkgJsonParser.parse(constants.DEPENDENCIES);
      this.keys.forEach((key) => {
        if (this.config[key][constants.DEV_MODE][constants.LINK]) {
          NpmYarnHandler.unlinkAndAddRepo(key, pkgJsonDependencies[key]);
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
    NpmYarnHandler.clean();
    updatePlaykitReposVersionsInPkgJson.call(this);
    upgradePlaykitRepos.call(this);
    NpmYarnHandler.release();
    ReleaseDataHandler.set(constants.KALTURA_PLAYER_JS, {
      version: Utils.getNewVersion(),
      changeLog: Utils.getChangeLog()
    });
  }

  completeReleaseMode() {
    NpmYarnHandler.publish();
  }

  cancelReleaseMode() {
    GitHandler.resetHardMaster();
    GitHandler.deleteLocalTag();
  }
}

function updatePlaykitReposVersionsInPkgJson() {
  let pkgContent = PkgJsonParser.parse();
  let releaseData = ReleaseDataHandler.get();
  Object.keys(releaseData).forEach((key) => {
    Utils.print(chalk.bold.underline.blue("- update " + chalk.italic(key) + " version in package.json to ") + chalk.yellow(releaseData[key].version));
    pkgContent[constants.DEPENDENCIES][key] = constants.REPO_URL_PREFIX + key + constants.REPO_URL_POSTFIX + releaseData[key].version;
    Utils.printDone();
  });
  fs.writeFileSync(constants.PACKAGE_JSON, JSON.stringify(pkgContent, null, 2));
  GitHandler.addAndCommit(constants.PACKAGE_JSON, 'chore(package.json): update playkit-js-* versions');
}

function upgradePlaykitRepos() {
  let pkgContent = PkgJsonParser.parse();
  let releaseData = ReleaseDataHandler.get();
  Object.keys(releaseData).forEach((key) => {
    NpmYarnHandler.upgrade(key, pkgContent[constants.DEPENDENCIES][key]);
  });
  GitHandler.addAndCommit(constants.YARN_LOCK, 'chore(yarn.lock): update playkit-js-* versions');
}

module.exports = KalturaPlayerController;
