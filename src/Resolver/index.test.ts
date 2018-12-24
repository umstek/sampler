jest.mock("./ChanceResolver");
import Resolver from "./index";
import ChanceResolver from "./ChanceResolver";

describe("Resolver", () => {
  const noneResolver = new Resolver([]);

  const chanceResolver = new ChanceResolver({ seed: 100 });
  const chanceBasedResolver = new Resolver([chanceResolver]);

  test("it returns type itself when configured with no sub-resolvers", () => {
    expect(noneResolver.resolve("name")).toBe("name");
    expect(noneResolver.resolve("number", { whatever: 0 })).toBe("number");
  });

  test("it works with other resolvers", () => {
    expect(chanceBasedResolver.resolve("name")).toBe("John Doe");
    expect(chanceBasedResolver.resolve("number")).toBe(9);
  });

  test("it preserves data given to nested resolver constructors", () => {
    expect(chanceBasedResolver.resolve("seed")).toBe(100);
  });

  test("it returns type itself when configured sub-resolvers don't support the type", () => {
    expect(chanceBasedResolver.resolve("x", {})).toBe("x");
  });
});
