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
const PLAYKIT_REPO_LIST = require("../configuration/repo-list.json");
const PLAYKIT_REPO_DATA = require("../configuration/repo-data.json");

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
      PLAYKIT_REPO_LIST.forEach((repoAlias) => {
        const playkit = this.playkits[repoAlias];
        if (playkit.include) {
          NpmYarnHandler.unlinkRepo(playkit.name);
        }
      });
      NpmYarnHandler.install();
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
    shell.config.silent = false;
    NpmYarnHandler.releaseDry();
    shell.config.silent = true;
    Utils.showPrompt('Observe upcoming release. Do you want to continue?', (ans) => {
      if (ans) {
        unlinkAndRemovePlaykitDirs.call(this);
        updatePlaykitReposVersionsInPkgJson.call(this);
        upgradePlaykitRepos.call(this);
        NpmYarnHandler.release();
        ReleaseDataHandler.set(constants.KALTURA_PLAYER_JS, {
          version: Utils.getNewVersion(),
          changeLog: Utils.getChangeLog()
        });
      }
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

function unlinkAndRemovePlaykitDirs() {
  PLAYKIT_REPO_LIST.forEach((repoAlias) => {
    const playkit = this.playkits[repoAlias];
    NpmYarnHandler.unlinkRepo(playkit.name);
    Utils.deleteNodeDirectory(playkit.name);
  });
}

function updatePlaykitReposVersionsInPkgJson() {
  let pkgContent = PkgJsonParser.parse();
  PLAYKIT_REPO_LIST.forEach((repoAlias) => {
    const playkit = this.playkits[repoAlias];
    if (playkit.include) {
      const data = PLAYKIT_REPO_DATA[repoAlias];
      const releaseData = ReleaseDataHandler.get(playkit.name);
      Utils.print(chalk.bold.underline.blue("- update " + chalk.italic(playkit.name) + " version in package.json to ") + chalk.yellow(releaseData.version));
      pkgContent[constants.DEPENDENCIES][playkit.name] = data.url + "#v" + releaseData.version;
      Utils.printDone();
    }
  });
  fs.writeFileSync(constants.PACKAGE_JSON, JSON.stringify(pkgContent, null, 2));
}

function upgradePlaykitRepos() {
  let pkgContent = PkgJsonParser.parse();
  PLAYKIT_REPO_LIST.forEach((repoAlias) => {
    const playkit = this.playkits[repoAlias];
    NpmYarnHandler.add(playkit.name, pkgContent[constants.DEPENDENCIES][playkit.name]);
  });
  GitHandler.add([constants.PACKAGE_JSON, constants.YARN_LOCK]);
  GitHandler.commit('chore(package.json): update playkit-js-* versions', 'playkit-js-* versions');
}

module.exports = KalturaPlayerController;
