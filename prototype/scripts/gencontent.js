const fs = require("fs");

const nouns = [
  "javascript",
  "math",
  "php",
  "node",
  "asparagus",
  "programming",
  "server",
  "golang",
  "script",
  "computer",
  "vim",
  "code editor",
  "text",
  "code",
  "html",
  "css",
  "candle",
  "kitchen",
  "word",
];
const verbs = [
  "write",
  "run",
  "code",
  "turn on",
  "turn off",
  "make",
  "go",
  "talk",
  "type",
  "generate",
  "read",
  "fight",
  "kill",
  "punch",
  "clean",
  "kick",
  "feed",
  "grow",
  "learn",
  "fail",
  "win",
  "is",
  "has",
];
const properNouns = [
  "I",
  "you",
  "they",
  "harvey",
  "charlie",
  "caroline",
  "josh",
  "francine",
  "grey cat",
];
const adj = [
  "fast",
  "slow",
  "quick",
  "good",
  "bad",
  "dirty",
  "clean",
  "readable",
  "yucky",
  "hot",
  "sexy",
  "beautiful",
  "powerful",
  "experimental",
  "tasty",
  "money",
  "fun",
];

const useVery = () => Math.random() >= 0.5;

function constructSentence() {
  const subject = properNouns[Math.floor(Math.random() * properNouns.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];
  const adjective = adj[Math.floor(Math.random() * adj.length)];
  const predicate = nouns[Math.floor(Math.random() * nouns.length)];

  return `${subject} ${verb} ${
    useVery ? "very" : ""
  } ${adjective} ${predicate}. `;
}

function createText(numberOfSentences) {
  let text = "";
  let current = 0;
  while (current !== numberOfSentences) {
    text += constructSentence();
    current++;
  }
  return text;
}

function write(path, content) {
  return new Promise((resolve, _reject) => {
    fs.writeFile(path, content, { encoding: "utf-8" }, () => resolve());
  });
}

(async function GenerateContent() {
  const NUMBER_OF_FILES = 25;
  for (let i = 0; i < NUMBER_OF_FILES; i++) {
    await write(
      `../content/test${i}.md`,
      createText(10 + Math.ceil(Math.random() * 50))
    );
  }
  console.log("all done! check it out ../content/");
})();
