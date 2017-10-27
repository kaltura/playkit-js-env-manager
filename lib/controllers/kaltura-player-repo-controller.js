#! /usr/bin/env node
const fs = require("fs");
const chalk = require("chalk");
const shell = require("shelljs");
const constants = require("../common/constants");
const Utils = require("../common/utils");
const PkgJsonParser = require("../common/pkg-json-parser");
const NpmYarnHandler = require("../common/npm-yarn-handler");
const GitHandler = require("../common/git-handler");
const ReleaseDataHandler = require("../common/release-data-handler");
const pkReposList = require("../configuration/repo-list.json");

class KalturaPlayerController {
  constructor(playkits) {
    this.playkits = playkits;
  }

  startDevMode() {
    try {
      const dependencies = PkgJsonParser.parse(constants.DEPENDENCIES);
      NpmYarnHandler.install(); // Install any package if missing
      pkReposList.forEach((repoAlias) => {
        const playkit = this.playkits[repoAlias];
        if (playkit.include) {
          NpmYarnHandler.linkRepo(playkit.name);
        } else {
          NpmYarnHandler.unlinkRepo(playkit.name);
          NpmYarnHandler.add(playkit.name, dependencies[playkit.name]);
        }
      });
      NpmYarnHandler.dev(constants.KALTURA_PLAYER_JS);
    } catch (e) {
      Utils.print(chalk.bold.red("✘ " + e.message + " ✘"));
    }
  }

  stopDevMode() {
    try {
      const dependencies = PkgJsonParser.parse(constants.DEPENDENCIES);
      pkReposList.forEach((repoAlias) => {
        const playkit = this.playkits[repoAlias];
        if (playkit.include) {
          NpmYarnHandler.unlinkRepo(playkit.name);
          NpmYarnHandler.add(playkit.name, dependencies[playkit.name]);
        }
      });
      NpmYarnHandler.build();
    } catch (e) {
      Utils.print(chalk.bold.red("✘ " + e.message + " ✘"));
    }
  }

  runReleaseMode() {
    GitHandler.stashChanges();
    GitHandler.checkoutMaster();
    NpmYarnHandler.clean();
    shell.config.silent = false;
    NpmYarnHandler.releaseDry();
    shell.config.silent = true;
    Utils.showPrompt('Observe upcoming release. Do you want to continue?', (ans) => {
      if (ans) {
        unlinkPlaykitRepos.call(this);
        updatePlaykitReposVersionsInPkgJson.call(this);
        upgradePlaykitRepos.call(this);
        NpmYarnHandler.release();
        ReleaseDataHandler.set(constants.KALTURA_PLAYER_JS, {
          version: Utils.getNewVersion(),
          changeLog: Utils.getChangeLog()
        });
        Utils.showPrompt('Observe release commits. Ready to publish ' + constants.KALTURA_PLAYER_JS + '?', (ans) => {
          if (ans) {
            completeReleaseMode.call(this);
          } else {
            cancelReleaseMode.call(this);
          }
        });
      }
    });
  }
}

function completeReleaseMode() {
  NpmYarnHandler.publish();
}

function cancelReleaseMode() {
  const rd = ReleaseDataHandler.get(constants.KALTURA_PLAYER_JS);
  GitHandler.resetHardMaster();
  GitHandler.deleteLocalTag(rd.version);
  ReleaseDataHandler.remove(constants.KALTURA_PLAYER_JS);
}

function unlinkPlaykitRepos() {
  pkReposList.forEach((repoAlias) => {
    const playkit = this.playkits[repoAlias];
    NpmYarnHandler.unlinkRepo(playkit.name);
  });
}

function updatePlaykitReposVersionsInPkgJson() {
  let pkgContent = PkgJsonParser.parse();
  pkReposList.forEach((repoAlias) => {
    const playkit = this.playkits[repoAlias];
    if (playkit.include) {
      const pkReleaseData = ReleaseDataHandler.get(playkit.name);
      Utils.print(chalk.bold.underline.blue("- update " + chalk.italic(playkit.name) + " version in package.json to ") + chalk.yellow(pkReleaseData.version));
      pkgContent[constants.DEPENDENCIES][playkit.name] = playkit.url + "#v" + pkReleaseData.version;
      Utils.printDone();
    }
  });
  fs.writeFileSync(constants.PACKAGE_JSON, JSON.stringify(pkgContent, null, 2));
}

function upgradePlaykitRepos() {
  const dependencies = PkgJsonParser.parse(constants.DEPENDENCIES);
  pkReposList.forEach((repoAlias) => {
    const playkit = this.playkits[repoAlias];
    NpmYarnHandler.add(playkit.name, dependencies[playkit.name]);
  });
  GitHandler.add([constants.PACKAGE_JSON, constants.YARN_LOCK]);
  GitHandler.commit('chore(package.json): update playkit-js-* versions', 'playkit-js-* versions');
}

module.exports = KalturaPlayerController;
