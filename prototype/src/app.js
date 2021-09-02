const fs = require("fs");
const { search } = require("./search.js");

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

(async function App() {
  const args = process.argv.slice(2);
  if (args[0] == "index") {
    require("./indexer").init();
    return;
  } else {
    const indexes = require("../indexes.json");
    paths = search(indexes, args.join(" "));
    console.log(
      paths.map(
        (p) =>
          `${p.path}:${p.score} ( ${args.map(
            (word) => `${word}: ${p.tokens[word] ? p.tokens[word] : 0},`
          )}, score: ${p.score} )`
      )
    );
  }
})();
