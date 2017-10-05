#! /usr/bin/env node
const chalk = require("chalk");
const fs = require("fs");
const constants = require("../common/constants");
const Utils = require("../common/utils");
const PkgJsonParser = require("../common/pkg-json-parser");
const NpmYarnHandler = require("../common/npm-yarn-handler");
const GitHandler = require("../common/git-handler");
const ReleaseDataHandler = require("../common/release-data-handler");

class PlaykitRepoController {
  constructor(options) {
    this.name = options.name;
    this.include = options.include;
    if (options.mode === constants.DEV_MODE) {
      this.version = options.version;
    }
  }

  startDevMode() {
    NpmYarnHandler.cleanAndUnlink();
    if (this.include) {
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
    } else {
      Utils.printNoAction();
    }
  }

  stopDevMode() {
    if (this.include) {
      NpmYarnHandler.cleanAndUnlink();
    } else {
      Utils.printNoAction();
    }
  }

  startReleaseMode() {
    if (!this.skip) {
      GitHandler.stashChanges();
      GitHandler.checkoutMaster();
      updatePlaykitJsDependenciesVersions();
      NpmYarnHandler.release();
      ReleaseDataHandler.set(this.name, {
        version: Utils.getNewVersion(),
        changeLog: Utils.getChangeLog()
      });
    }
  }

  completeReleaseMode() {
    NpmYarnHandler.publish();
  }

  cancelReleaseMode() {
    GitHandler.resetHardMaster();
    GitHandler.deleteLocalTag();
  }
}

function updatePlaykitJsDependenciesVersions() {
  let updated = false;
  let pkgContent = PkgJsonParser.parse();
  Object.keys(ReleaseDataHandler.get()).forEach((key) => {
    if (pkgContent[constants.PEER_DEPENDENCIES] && pkgContent[constants.PEER_DEPENDENCIES][key]) {
      updated = true;
      let version = ReleaseDataHandler.get(key)[constants.VERSION];
      pkgContent[constants.PEER_DEPENDENCIES][key] = constants.REPO_URL_PREFIX + key + constants.REPO_URL_POSTFIX + version;
    }
  });
  if (updated) {
    fs.writeFileSync(constants.PACKAGE_JSON, JSON.stringify(pkgContent, null, 2));
    GitHandler.addAndCommit(constants.PACKAGE_JSON, 'chore(package.json): update playkit-js-* dependencies versions');
  }
}

module.exports = PlaykitRepoController;
