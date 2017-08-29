#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const fs = require("fs");
const constants = require("../common/constants");
const Utils = require("../common/utils");
const PkgJsonParser = require("../common/pkg-json-parser");
const NpmYarnHandler = require("../common/npm-yarn-handler");
const GitHandler = require("../common/git-handler");
const ReleaseDataHandler = require("../common/release-data-handler");

class PlaykitRepoController {
  constructor(repo, config, mode) {
    this.repo = repo;
    this.config = config;
    if (mode === constants.DEV_MODE) {
      this.version = this.config[constants.VERSION] || constants.LATEST;
      this.watch = this.config[constants.WATCH] || false;
      this.link = this.config[constants.LINK] || false;
    } else {
      this.skip = this.config[constants.SKIP] || false;
    }
  }

  startDevMode() {
    NpmYarnHandler.cleanAndUnlink();
    if (this.link) {
      if (this.version === constants.LOCAL) {
        Utils.print(chalk.bold.underline.blue("- staying on local branch"));
        Utils.printDone();
      } else {
        GitHandler.stashChanges();
        if (this.version === constants.LATEST) {
          GitHandler.checkoutMaster();
        } else if (this.version === constants.VERSION)
          GitHandler.checkoutVersion(this.version);
      }
      NpmYarnHandler.buildAndLink();
      if (this.watch) {
        NpmYarnHandler.watch(this.repo);
      }
    } else {
      Utils.printNoAction();
    }
  }

  stopDevMode() {
    if (this.link) {
      NpmYarnHandler.cleanAndUnlink();
    } else {
      Utils.printNoAction();
    }
  }

  startReleaseMode() {
    if (!this.skip) {
      GitHandler.stashChanges();
      GitHandler.checkoutMaster();
      if (this.repo !== constants.PLAYKIT_JS) {
        updatePlaykitJsVersion();
      }
      NpmYarnHandler.release();
      ReleaseDataHandler.set(this.repo, {
        version: Utils.getNewVersion(),
        changeLog: Utils.getChangeLog()
      });
    }
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

function updatePlaykitJsVersion() {
  let pkVersion = ReleaseDataHandler.get(constants.PLAYKIT_JS)[constants.VERSION];
  let pkFullUrlVersion = constants.REPO_URL_PREFIX + constants.PLAYKIT_JS + constants.REPO_URL_POSTFIX + pkVersion;
  let pkgContent = PkgJsonParser.parse();
  if (pkgContent[constants.PEER_DEPENDENCIES] && pkgContent[constants.PEER_DEPENDENCIES][constants.PLAYKIT_JS]) {
    Utils.print(chalk.bold.underline.blue("- update playkit.js version in package.json"));
    pkgContent[constants.PEER_DEPENDENCIES][constants.PLAYKIT_JS] = pkFullUrlVersion;
    fs.writeFileSync(constants.PACKAGE_JSON, JSON.stringify(pkgContent, null, 2));
    shell.exec("git add package.json");
    shell.exec("git commit -m 'chore(package.json): update playkit-js version'");
    Utils.printDone();
  }
}

module.exports = PlaykitRepoController;
