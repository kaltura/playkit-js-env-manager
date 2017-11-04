const Utils = require('./utils');
const constants = require('./constants');
const ReleaseDataHandler = require('./release-data-handler');
const GitHubApi = require('github');
const github = new GitHubApi();

github.authenticate({
  type: 'token',
  token: process.env.USER_TOKEN
});

class GitHubConnector {
  static createRelease(repo) {
    Utils.printGitHubApi('creating release');
    const releaseData = ReleaseDataHandler.get(repo);
    return github.repos.createRelease({
      owner: constants.KALTURA,
      repo: repo,
      tag_name: 'v' + releaseData.version,
      name: 'v' + releaseData.version,
      body: Utils.getReleaseNotes(repo)
    });
  }
}

module.exports = GitHubConnector;
