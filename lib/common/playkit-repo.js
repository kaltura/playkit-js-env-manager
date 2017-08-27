#! /usr/bin/env node
const shell = require("shelljs");
const chalk = require("chalk");
const fs = require("fs");
const constants = require("./constants");
const utils = require("./utils");
const pkgJsonParser = require("./pkg-json-parser");
const changelogParser = require("./changelog-parser");

let _repo;
let _config;
let _version;
let _watch;
let _link;
let _releaseData = {};

module.exports = {
  init(repo, config) {
    _repo = repo;
    _config = config;
    shell.cd("../" + _repo);
  },
  startDevMode() {
    configureDevMode();
    startDevMode();
  },
  stopDevMode() {
    configureDevMode();
    stopDevMode();
  },
  startReleaseMode() {
    startReleaseMode();
  }
};

function configureDevMode() {
  _version = _config[constants.VERSION] || constants.LATEST;
  _watch = _config[constants.WATCH] || false;
  _link = _config[constants.LINK] || false;
}

function stashChanges() {
  utils.print(chalk.bold.underline.blue("- stash changes"));
  shell.exec("git stash");
  utils.printDone();
}

function checkoutMaster() {
  utils.print(chalk.bold.underline.blue("- checkout master"));
  shell.exec("git checkout master");
  utils.printDone();
  utils.print(chalk.bold.underline.blue("- pull origin master"));
  shell.exec("git pull origin master");
  utils.printDone();
}

function checkoutVersion() {
  utils.print(chalk.bold.underline.blue("- fetch tags"));
  shell.exec("git fetch --all --tags --prune");
  utils.printDone();
  utils.print(chalk.bold.underline.blue("- checkout tag " + _version));
  shell.exec("git checkout tags/" + _version);
  utils.printDone();
}

function startDevMode() {
  cleanAndUnlink();
  if (_link) {
    if (_version === constants.LOCAL) {
      stayOnLocalBranch();
    } else {
      stashChanges();
      if (_version === constants.LATEST) {
        checkoutMaster();
      } else if (_version === constants.VERSION)
        checkoutVersion();
    }
    buildAndLink();
    if (_watch) {
      watch();
    }
  } else {
    utils.printNoAction();
  }
}

function stopDevMode() {
  if (_link) {
    cleanAndUnlink();
  } else {
    utils.printNoAction();
  }
}

function buildAndLink() {
  utils.print(chalk.bold.underline.blue("- build project"));
  shell.exec("npm run build");
  utils.printDone();
  utils.print(chalk.bold.underline.blue("- link package"));
  shell.exec("yarn link");
  utils.printDone();
}

function stayOnLocalBranch() {
  utils.print(chalk.bold.underline.blue("- staying on local branch"));
  utils.printDone();
}

function cleanAndUnlink() {
  utils.print(chalk.bold.underline.magenta("- clean dist"));
  shell.exec("npm run clean");
  utils.printDone();
  utils.print(chalk.bold.underline.magenta("- unlink package"));
  shell.exec("yarn unlink");
  utils.printDone();
}

function watch() {
  utils.print(chalk.bold.dim("start dev-mode server in new tab ( ͡° ͜ʖ ͡°)"));
  shell.exec("ttab -t ◉_◉" + _repo + "◉_◉ -G exec npm run dev")
}

function release() {
  utils.print(chalk.bold.underline.blue("- release (using standard-version)"));
  shell.exec("npm run release");
  utils.printDone();
}

function checkoutDevelop() {
  utils.print(chalk.bold.underline.blue("- checkout develop"));
  shell.exec("git checkout develop");
  utils.printDone();
  utils.print(chalk.bold.underline.blue("- pull origin develop"));
  shell.exec("git pull origin develop");
  utils.printDone();
}

function getNewVersion() {
  let newVersion = pkgJsonParser.parse(constants.VERSION);
  utils.print(chalk.bold.underline.blue("- extract new version:") + chalk.green(" " + newVersion));
  utils.printDone();
  return newVersion;
}

function getChangeLog() {
  let changelog = changelogParser.parse();
  utils.print(chalk.bold.underline.blue("- extract changelog"));
  utils.printDone();
  return changelog;
}

function updatePlaykitJsVersion() {
  /**
   * TODO: replace to this line
   */
    // let playkitVersion = "https://github.com/kaltura/playkit-js.git#" + _releaseData[constants.PLAYKIT_JS].version;
  let playkitVersion = "https://github.com/kaltura/playkit-js.git#v5.5.5";
  let pkgContent = pkgJsonParser.parse();
  if (pkgContent[constants.PEER_DEPENDENCIES][constants.PLAYKIT_JS] && pkgContent[constants.DEV_DEPENDENCIES][constants.PLAYKIT_JS]) {
    utils.print(chalk.bold.underline.blue("- updates playkit.js version in package.json"));
    pkgContent[constants.PEER_DEPENDENCIES][constants.PLAYKIT_JS] = playkitVersion;
    pkgContent[constants.DEV_DEPENDENCIES][constants.PLAYKIT_JS] = playkitVersion;
    fs.writeFileSync(constants.PACKAGE_JSON, JSON.stringify(pkgContent, null, 2));
    shell.exec("git add package.json");
    shell.exec("git commit -m 'chore(package.json): update playkit.js version'");
    utils.printDone();
  }
}

function saveReleaseData() {
  _releaseData[_repo] = {
    version: getNewVersion(),
    changeLog: getChangeLog()
  };
}

function startReleaseMode() {
  if (!_config[constants.SKIP] || _repo === constants.PLAYKIT_JS) {
    stashChanges();
    /**
     * TODO: replace to checkoutMaster and delete checkoutDevelop
     */
    checkoutDevelop();
    if (_repo !== constants.PLAYKIT_JS) {
      updatePlaykitJsVersion();
    }
    release();
    saveReleaseData();
  }
}

function publish() {
  utils.print(chalk.bold.underline.blue("- publish"));
  shell.exec("npm run publish");
  utils.printDone();
}
