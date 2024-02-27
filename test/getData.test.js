const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const { getCssData, getTailwindToCssData } = require("../getData");

let expect;

before(async function () {
  const chai = await import("chai");
  expect = chai.expect;
});

describe("Data Fetching Tests", function () {
  let mock;

  before(function () {
    mock = new MockAdapter(axios);
  });

  after(function () {
    mock.restore();
  });

  it("getCssData should fetch CSS compatibility data", async function () {
    const testData = { data: "test CSS data" };
    mock
      .onGet(
        "https://raw.githubusercontent.com/Fyrd/caniuse/main/fulldata-json/data-2.0.json",
      )
      .reply(200, testData);

    const response = await getCssData();
    expect(response.data).to.deep.equal(testData);
  });
});
