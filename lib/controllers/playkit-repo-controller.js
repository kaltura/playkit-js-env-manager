#! /usr/bin/env node
const chalk = require("chalk");
const fs = require("fs");
const shell = require("shelljs");
const constants = require("../common/constants");
const Utils = require("../common/utils");
const PkgJsonParser = require("../common/pkg-json-parser");
const NpmYarnHandler = require("../common/npm-yarn-handler");
const GitHandler = require("../common/git-handler");
const ReleaseDataHandler = require("../common/release-data-handler");
const PLAYKIT_REPO_DATA = require("../configuration/repo-data.json");

class PlaykitRepoController {
  constructor(options) {
    this.alias = options.alias;
    this.name = options.name;
    this.include = options.include;
    if (options.mode === constants.DEV_MODE) {
      this.version = options.version;
    }
  }

  startDevMode() {
    NpmYarnHandler.cleanAndUnlink();
    if (this.version === constants.LOCAL) {
      Utils.print(chalk.bold.underline.blue("- staying on local branch"));
      Utils.printDone();
    } else {
      GitHandler.stashChanges();
      if (this.version === constants.LATEST) {
        GitHandler.checkoutMaster();
      } else {
        GitHandler.checkoutVersion(this.version);
      }
    }
    NpmYarnHandler.buildAndLink();
    NpmYarnHandler.watch(this.name);
  }

  stopDevMode() {
    NpmYarnHandler.cleanAndUnlink();
  }

  startReleaseMode() {
    return new Promise((resolve) => {
      // GitHandler.stashChanges();
      // GitHandler.checkoutMaster();
      // GitHandler.fetchTags();
      shell.config.silent = false;
      NpmYarnHandler.releaseDry();
      shell.config.silent = true;
      Utils.showPrompt('Observe upcoming release. Do you want to continue?', (ans) => {
        if (ans) {
          updatePlaykitJsDependenciesVersions.call(this);
          NpmYarnHandler.release();
          Utils.showPrompt('Observe release commits. Do you want to continue?', (ans) => {
            if (ans) {
              ReleaseDataHandler.set(this.name, {
                version: Utils.getNewVersion(),
                changeLog: Utils.getChangeLog()
              });
              resolve();
            } else {
              this.cancelReleaseMode();
              this.include = false;
              resolve();
            }
          });
        } else {
          this.include = false;
          resolve();
        }
      });
    });
  }

  completeReleaseMode() {
    NpmYarnHandler.publish();
    return Promise.resolve();
  }

  cancelReleaseMode() {
    GitHandler.resetHardMaster();
    GitHandler.deleteLocalTag();
    return Promise.resolve();
  }
}

function updatePlaykitJsDependenciesVersions() {
  let updated = false;
  const pkgContent = PkgJsonParser.parse();
  const data = PLAYKIT_REPO_DATA[this.alias];
  const peerDependencies = data.peerDependencies;
  const devDependencies = data.devDependencies;
  if (peerDependencies.length > 0) {
    peerDependencies.forEach((peerDependenceAlias) => {
      const data = PLAYKIT_REPO_DATA[peerDependenceAlias];
      const name = data.name;
      const releaseData = ReleaseDataHandler.get(name);
      const version = releaseData[constants.VERSION];
      pkgContent[constants.PEER_DEPENDENCIES][name] = data.url + "#v" + version;
      updated = true;
    });
  }
  if (devDependencies.length > 0) {
    devDependencies.forEach((devDependenceAlias) => {
      const data = PLAYKIT_REPO_DATA[devDependenceAlias];
      const name = data.name;
      const releaseData = ReleaseDataHandler.get(name);
      const version = releaseData[constants.VERSION];
      pkgContent[constants.DEV_DEPENDENCIES][name] = data.url + "#v" + version;
      updated = true;
    });
  }
  if (updated) {
    fs.writeFileSync(constants.PACKAGE_JSON, JSON.stringify(pkgContent, null, 2));
    GitHandler.addAndCommit(constants.PACKAGE_JSON, 'chore(package.json): update playkit-js-* versions');
  }
}

module.exports = PlaykitRepoController;
