#! /usr/bin/env node
const fs = require("fs");

class ChangelogParser {
  static parse(version) {
    let result = {
      title: '',
      bugFixes: {title: 'Bug Fixes', content: []},
      features: {title: 'Features', content: []}
    };
    try {
      let rawChangelog = getRawChangelog(version);
      let rawChangelogParts = rawChangelog.split("###");
      result.title = getHeader(rawChangelogParts[0]);
      for (let i = 1; i < rawChangelogParts.length; i++) {
        let parts = removeEmptyLines(removeEndOfLines(rawChangelogParts[i]).split("*"));
        if (parts[0].trim() === 'Bug Fixes') {
          result.bugFixes.content = parseContent(parts);
        } else if (parts[0].trim() === 'Features') {
          result.features.content = parseContent(parts);
        }
      }
      return result;
    } catch (e) {
      console.error("Error occurred while parsing CHANGELOG.md");
      console.error(e.message);
    }
  }
}

function parseContent(parts) {
  let res = [];
  for (let i = 1; i < parts.length; i++) {
    if (isHeader(parts[i])) {
      res.push('* ' + parts[i].trim() + parts[++i].trim());
    } else {
      res.push('* ' + parts[i].trim());
    }
  }
  return res;
}

function getRawChangelog(version) {
  let changelogContent = fs.readFileSync('CHANGELOG.md', {encoding: 'utf-8'});
  let regex = new RegExp('<a name="*.*.*"></a>');
  let changelogParts = changelogContent.split(regex);
  for (let i = 0; i < changelogParts.length; i++) {
    changelogParts[i] = changelogParts[i].replace('\n# ', '');
    changelogParts[i] = changelogParts[i].replace('\n## ', '');
  }
  return version ? changelogParts.find(part => part.startsWith('[' + version + ']')) : changelogParts[1];
}

function getHeader(firstLine) {
  return removeEndOfLines(firstLine).replace("##", "").replace("#", "").trim();
}

function removeEndOfLines(line) {
  return line.replace(/(?:\n\n\n|\n\n|\n)/g, "")
}

function isEmptyLine(s) {
  return s === '' || s === ' ';
}

function isHeader(s) {
  return s.endsWith(':');
}

function removeEmptyLines(parts) {
  return parts.filter((part) => !isEmptyLine(part));
}

module.exports = ChangelogParser;
