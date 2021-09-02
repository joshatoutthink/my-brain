const { generateTokens, markdownTitle } = require("./indexer.js");
const { search } = require("./search.js");

console.log("Can we generate tokens from text");
{
  const input = "hello charlie. hello josh. hello josh";
  const expected = JSON.stringify({ hello: 3, charlie: 1, josh: 2 });
  const actual = JSON.stringify(generateTokens(input));
  console.log("generateTokens Works", expected === actual);
  if (expected !== actual) {
    console.log(actual);
  }
}

console.log("Can we search using the index");
{
  const expected = "one";
  const actual = search(
    {
      one: { path: "one", tokens: { hey: 2, there: 2, cowboy: 1 } },
      two: { path: "two", tokens: { hey: 2, there: 3 } },
    },
    "hey there cowboy"
  );

  console.log("search Works", expected === actual[0].path);
  if (expected !== actual) {
    console.log(actual);
  }
}

{
  console.log("Can find headings in markdown files");
  const expected = "Hey there";
  const actual = markdownTitle(
    `---\ntitle: Hey there\n this is a p\nhey again`
  );
  console.log("Found heading", expected == actual);
  if (expected != actual) {
    console.log("heading", actual);
  }
}
