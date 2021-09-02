const fs = require("fs");

function readFile(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

function write(path, content) {
  return new Promise((resolve, _reject) => {
    fs.writeFile(path, content, { encoding: "utf-8" }, () => resolve());
  });
}

function search(indexes, query) {
  const words = query.replace(".", "").toLowerCase().split(" ");
  const docsList = {}; // this holds all the documents that will be sent

  // score docs based on:
  // - times a word occurs
  // - how many words the doc contains

  for (word of words) {
    for (id in indexes) {
      if (!indexes[id].tokens[word]) continue;

      if (!docsList[id]) {
        docsList[id] = 0;
      }
      docsList[id] = docsList[id] + 10 + indexes[id].tokens[word];
      if (
        indexes[id].heading &&
        indexes[id].heading.toLowerCase().includes(word.toLowerCase())
      ) {
        console.log("advantage by heading");
        docsList[id] = docsList[id] + 5;
      }
    }
  }

  return Object.keys(docsList)
    .map((path) => ({ ...indexes[path], score: docsList[path] }))
    .sort((a, b) => b.score - a.score);
}

module.exports = { search };
