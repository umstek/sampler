import EmptyResolver from "./EmptyResolver";

describe("EmptyResolver", () => {
  const emptyResolver = new EmptyResolver();

  test("it returns null for any string and any args", () => {
    expect(emptyResolver.resolve("")).toBeNull();
    expect(emptyResolver.resolve("asd", {})).toBeNull();
  });
});
