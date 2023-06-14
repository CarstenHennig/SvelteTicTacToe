// backend/storage.js
let matches = [];

function saveMatchResult(result) {
  matches.push(result);
}

function getMatchResults() {
  return matches;
}

module.exports = {
  saveMatchResult,
  getMatchResults,
};
