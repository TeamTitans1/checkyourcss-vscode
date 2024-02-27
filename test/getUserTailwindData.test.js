function getUserTailwindDataMock(tailwindToCss) {
  return tailwindToCss.map(entry => ({
    tw: entry.className,
    css: entry.cssProperty,
  }));
}

before(async function () {
  const chai = await import("chai");
  expect = chai.expect;
});

describe("getUserTailwindData", function () {
  it("should correctly map Tailwind classes to CSS properties", function () {
    const tailwindToCssMock = [
      { className: "text-center", cssProperty: "text-align: center;" },
      { className: "bg-red-500", cssProperty: "background-color: #f56565;" },
    ];

    const expected = [
      { tw: "text-center", css: "text-align: center;" },
      { tw: "bg-red-500", css: "background-color: #f56565;" },
    ];

    const result = getUserTailwindDataMock(tailwindToCssMock);
    expect(result).to.deep.equal(expected);
  });
});
