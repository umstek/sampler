import Parser, * as parserUtil from "./Parser";
jest.mock("./Resolver/ChanceResolver");
import ChanceResolver from "./Resolver/ChanceResolver";

describe("Parser functions", () => {
  describe("Unescape", () => {
    test("it doesn't change strings w/o $ prefix", () => {
      expect(parserUtil.unescape("asdf")).toBe("asdf");
    });

    test("it doesn't change strings w/ only one $ prefix", () => {
      expect(parserUtil.unescape("$asdf")).toBe("$asdf");
    });

    test("it unescapes $ signs in case of more than one", () => {
      expect(parserUtil.unescape("$$asdf")).toBe("$asdf");
      expect(parserUtil.unescape("$$$asdf")).toBe("$$asdf");
    });
  });

  describe("FindResolver", () => {
    test("it returns chance resolver constructor when asked", () => {
      expect(parserUtil.findResolver("chance")).toBe(ChanceResolver);
    });
  });

  describe("Initialize", () => {
    test("it initializes the root resolver with empty $init", () => {
      const parser = new Parser({ chance: ChanceResolver });
      parser.initialize({});

      expect(parser.resolver).toBeDefined();
    });

    test("it initializes the root resolver when unknown resolver names present in $init", () => {
      const parser = new Parser({ chance: ChanceResolver });
      parser.initialize({ whatever: { seed: 10 } });

      expect(parser.resolver).toBeDefined();
    });

    test("it initializes the root resolver when correct resolver names present in $init", () => {
      const parser = new Parser({ chance: ChanceResolver });
      parser.initialize({ chance: { seed: 10 } });

      expect(parser.resolver).toBeDefined();
    });
  });

  describe("ParseSwitch", () => {
    let parser: Parser;

    beforeAll(() => {
      parser = new Parser({ chance: ChanceResolver });
      parser.initialize({});
    });

    afterAll(() => {
      parser = undefined;
    });

    beforeEach(() => {
      jest.spyOn(parser, "parseSwitch");

      jest.spyOn(parser.resolver, "resolve");
      jest.spyOn(parser, "parseArray");
      jest.spyOn(parser, "parseObject");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("it calls resolve of resolver if argument is a string", () => {
      parser.parseSwitch("name");

      expect(parser.parseSwitch).toBeCalled();
      expect(parser.parseArray).not.toBeCalled();
      expect(parser.parseObject).not.toBeCalled();
      expect(parser.resolver.resolve).toBeCalledWith("name");
    });

    test("it calls parseArray if argument is an array", () => {
      parser.parseSwitch([]);

      expect(parser.parseSwitch).toBeCalled();
      expect(parser.resolver.resolve).not.toBeCalled();
      expect(parser.parseObject).not.toBeCalled();
      expect(parser.parseArray).toBeCalledWith([]);
    });

    test("it calls parseObject if argument is an object", () => {
      parser.parseSwitch({});

      expect(parser.parseSwitch).toBeCalled();
      expect(parser.resolver.resolve).not.toBeCalled();
      expect(parser.parseArray).not.toBeCalled();
      expect(parser.parseObject).toBeCalledWith({});
    });

    test("it returns the object itself, otherwise", () => {
      const func = () => null; // Whatever func at my disposal
      parser.parseSwitch(func);

      expect(parser.resolver.resolve).not.toBeCalled();
      expect(parser.parseArray).not.toBeCalled();
      expect(parser.parseObject).not.toBeCalled();
      expect(parser.parseSwitch).toReturnWith(func);
    });
  });

  describe("ParseArray", () => {
    let parser: Parser;

    beforeAll(() => {
      parser = new Parser({ chance: ChanceResolver });
      parser.initialize({});
    });

    afterAll(() => {
      parser = undefined;
    });

    beforeEach(() => {
      jest.spyOn(parser, "parseSwitch");

      jest.spyOn(parser.resolver, "resolve");
      jest.spyOn(parser, "parseArray");
      jest.spyOn(parser, "parseObject");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("it calls parseSwitch for each array item", () => {
      parser.parseArray([{}, 1, "string"]);

      expect(parser.parseSwitch).toBeCalledTimes(3);
    });
  });

  describe("ParseObject", () => {
    let parser: Parser;

    beforeAll(() => {
      parser = new Parser({ chance: ChanceResolver });
      parser.initialize({ seed: 99 });
    });

    afterAll(() => {
      parser = undefined;
    });

    beforeEach(() => {
      jest.spyOn(parser, "parseSwitch");

      jest.spyOn(parser.resolver, "resolve");
      jest.spyOn(parser, "parseArray");
      jest.spyOn(parser, "parseObject");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("it doesn't call parseSwitch for an empty object", () => {
      parser.parseObject({});

      expect(parser.parseSwitch).not.toBeCalled();
      expect(parser.parseObject).toReturnWith({});
    });

    test("it calls parseSwitch for an object with keys", () => {
      parser.parseObject({ a: "seed", b: "name" });

      expect(parser.parseSwitch).toBeCalledTimes(2);
      expect(parser.resolver.resolve).toBeCalledWith("seed");
      expect(parser.resolver.resolve).toBeCalledWith("name");
      expect(parser.parseObject).toReturn();
    });
  });
});
