const fs = require('fs');
const path = require('path');

const log = path.resolve(path.join(__dirname, '../CHANGELOG.md'));
const text = fs.readFileSync(log).toString('utf-8');
const matches = /## \[.+?## \[/ms.exec(text);
if (!matches || !matches.length || !matches[0] || !matches[0].length) return;

const match = matches[0];
const note = path.resolve(path.join(__dirname, '../RELEASE.md'));
fs.writeFileSync(note, match.substr(0, match.length - 4), {
  encoding: 'utf-8',
  flag: 'w+',
});
