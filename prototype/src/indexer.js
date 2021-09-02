const fs = require("fs");
const { createHash } = require("crypto");
const path = require("path");
const { basename, extname, resolve: pResolve } = path;

//const CONTENT_DIR = "../content";
const CONTENT_DIR = "/Users/joshkennedy00/sites/joshs/sandbox/content/brain";
const INDEX_FILE =
  "/Users/joshkennedy00/sites/joshs/my-brain/prototype/indexes.json";

function pathsFromDir(path, files = []) {
  return new Promise((resolve, reject) => {
    fs.readdir(path, { encoding: "utf-8" }, async (err, filePaths) => {
      if (err) reject(err);
      for (fp of filePaths) {
        if (fp == ".DS_Store") continue;
        //SKIP MEDIA FILES
        const extension = extname(fp);
        console.log(fp, extension);
        if (
          extension == ".png" ||
          extension === ".jpg" ||
          extension === ".mp4" ||
          extension === ".mov"
        )
          continue;

        //try {
        const fStats = fs.statSync(pResolve(path, fp));
        if (fStats.isFile()) {
          files.push(pResolve(path, fp));
        } else {
          const filesInDir = await pathsFromDir(pResolve(path, fp));
          files.push(...filesInDir);
        }
        //} catch {
        continue;
        //}
      }
      resolve(files);
    });
  });
}

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

function generateTokens(string) {
  const words = string
    .split(/\s/)
    .map((word) => word.replaceAll(/[^A-Za-z0-9]/g, "").toLowerCase())
    .filter(removeStopWords);

  const tokens = words.reduce((tokens, word) => {
    if (!word) return tokens;

    if (!tokens[word]) {
      tokens[word] = 0;
    }

    tokens[word] = tokens[word] + 1;
    return tokens;
  }, {});

  return tokens;
}
//MAIN
async function init() {
  const startTime = Date.now();
  const files = await pathsFromDir(CONTENT_DIR);
  console.log(files);
  let indexes = {};
  for (fpath of files) {
    const fContent = await readFile(`${fpath}`).catch((e) => console.error(e));
    // module specific??
    const heading = markdownTitle(fContent);
    const md5 = createHash("md5");
    md5.update(fpath);
    const id = md5.digest("hex");
    console.log(id);
    indexes[id] = {
      id,
      path: fpath,
      tokens: generateTokens(fContent),
      content: fContent.substr(0, 50),
      heading,
    };
  }

  await write(INDEX_FILE, JSON.stringify(indexes, null, 2));
  const finishedTime = Date.now();
  console.log("finished", `${(finishedTime - startTime) / 1000} seconds`);
}

//HELPERS: should be in own module
function markdownH1(content) {
  const lines = content.split("\n");
  let heading = "";
  for (line of lines) {
    const cleanedLine = line.trim();
    if (cleanedLine.substr(0, 2) == "# " || cleanedLine.substr(0, 2) == "#\t") {
      heading = cleanedLine.substring(2);
      return heading;
    }
  }
  return heading;
}
function markdownTitle(content) {
  const lines = content.split("\n");
  let heading = "";
  for (line of lines) {
    const cleanedLine = line.trim();
    if (cleanedLine.substr(0, 6) === `title:`) {
      heading = cleanedLine.replace(`title:`, "").trim();
      return heading;
    }
  }
  return heading;
}
const stopWords = [
  "a",
  "about",
  "an",
  "are",
  "and",
  "as",
  "at",
  "be",
  "but",
  "by",
  "co",
  "com",
  "do",
  "don't",
  "for",
  "from",
  "has",
  "have",
  "he",
  "his",
  "http",
  "https",
  "i",
  "i'm",
  "in",
  "is",
  "it",
  "it's",
  "just",
  "like",
  "me",
  "my",
  "not",
  "of",
  "on",
  "or",
  "rt",
  "so",
  "t",
  "that",
  "the",
  "they",
  "this",
  "to",
  "twitter",
  "was",
  "we",
  "were",
  "with",
  "you",
  "your",
];
function removeStopWords(word) {
  return !stopWords.includes(word);
}

module.exports = { init, generateTokens, markdownH1, markdownTitle };
