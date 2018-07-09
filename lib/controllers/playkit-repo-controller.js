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
const pkReposData = require("../repo-data.json");
const GitHubConnector = require("../common/github-api");

class PlaykitRepoController {
  constructor(options) {
    this.alias = options.alias;
    this.name = options.name;
    this.include = options.include;
    this.url = options.url;
    this.peerDependencies = options.peerDependencies;
    this.devDependencies = options.devDependencies;
    this.usingBundleBuilder = options.usingBundleBuilder;
    if (options.mode === constants.DEV_MODE) {
      this.version = options.version;
    }
  }

  startDevMode() {
    if (this.version === constants.LOCAL) {
      Utils.print(chalk.bold.underline.blue("- staying on local branch"));
      Utils.printDone();
    } else {
      GitHandler.stashChanges();
      if (this.version === constants.LATEST) {
        GitHandler.checkoutMaster();
      } else {
        const regex = new RegExp('[v]\\d+.\\d+.\\d+');
        const res = regex.exec(this.version);
        if (res) {
          GitHandler.checkoutVersion(this.version);
        } else {
          GitHandler.checkoutBranch(this.version);
        }
      }
    }
    NpmYarnHandler.buildAndLink();
    NpmYarnHandler.watch(this.name);
  }

  stopDevMode() {
    NpmYarnHandler.cleanAndUnlink();
  }

  runReleaseMode() {
    return new Promise((resolve) => {
      GitHandler.stashChanges();
      GitHandler.checkoutMaster();
      GitHandler.fetchTags();
      shell.config.silent = false;
      NpmYarnHandler.releaseDry();
      shell.config.silent = true;
      Utils.showPrompt('Observe upcoming release. Do you want to continue?', (ans) => {
        if (ans) {
          updatePlaykitJsDependenciesVersions.call(this);
          NpmYarnHandler.release();
          const newVersion = Utils.getNewVersion();
          const changelog = Utils.getChangeLog();
          ReleaseDataHandler.set(this.name, {
            url: '//github.com/kaltura/' + this.name + '/releases/tag/v' + newVersion,
            version: newVersion,
            changeLog: changelog
          });
          Utils.showPrompt('Observe release commits. Ready to publish ' + this.name + '?', (ans) => {
            if (ans) {
              completeReleaseMode.call(this);
              GitHubConnector.createRelease(this.name)
                .then(() => {
                  Utils.printDone();
                  resolve();
                })
                .catch((err) => {
                  Utils.printError(err);
                  resolve();
                });
            } else {
              cancelReleaseMode.call(this);
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
}

function completeReleaseMode() {
  NpmYarnHandler.publish();
}

function cancelReleaseMode() {
  const rd = ReleaseDataHandler.get(this.name);
  GitHandler.resetHardMaster();
  GitHandler.deleteLocalTag(rd.version);
  ReleaseDataHandler.remove(this.name);
}

function updatePlaykitJsDependenciesVersions() {
  let updated = false;
  const pkgContent = PkgJsonParser.parse();
  if (this.peerDependencies.length > 0) {
    this.peerDependencies.forEach((peerDependenceAlias) => {
      const pdData = pkReposData[peerDependenceAlias];
      const pdName = pdData.name;
      const pdUrl = pdData.url;
      const pdReleaseData = ReleaseDataHandler.get(pdName);
      if (pdReleaseData) {
        const pdVersion = pdReleaseData[constants.VERSION];
        pkgContent[constants.PEER_DEPENDENCIES][pdName] = pdUrl + "#v" + pdVersion;
        updated = true;
      }
    });
  }
  if (this.devDependencies.length > 0) {
    this.devDependencies.forEach((devDependenceAlias) => {
      const ddData = pkReposData[devDependenceAlias];
      const ddName = ddData.name;
      const ddUrl = ddData.url;
      const ddReleaseData = ReleaseDataHandler.get(ddName);
      if (ddReleaseData) {
        const ddVersion = ddReleaseData[constants.VERSION];
        pkgContent[constants.DEV_DEPENDENCIES][ddName] = ddUrl + "#v" + ddVersion;
        updated = true;
      }
    });
  }
  if (updated) {
    fs.writeFileSync(constants.PACKAGE_JSON, JSON.stringify(pkgContent, null, 2));
    NpmYarnHandler.install();
    GitHandler.add([constants.PACKAGE_JSON, constants.YARN_LOCK]);
    GitHandler.commit('chore(package.json): update playkit-js-* versions', 'playkit-js-* versions');
  }
}

module.exports = PlaykitRepoController;
