const main = require("../src/index");

const commitsExample = require("./fixtures/commits.json");

jest.mock("@actions/core");
jest.mock("@actions/github");
jest.mock("node-fetch");

test("can run", () => {
  require("@actions/github").mockSetPayload(commitsExample);

  const output = main();

  expect(output).toBe(2);
});
