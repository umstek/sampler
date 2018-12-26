import Parser, * as parserUtil from "./Parser";
jest.mock("./Resolver/ChanceResolver");
import ChanceResolver from "./Resolver/ChanceResolver";
import EmptyResolver from "./Resolver/EmptyResolver";

describe.only("Parser functions", () => {
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

    test("it returns empty resolver when asked one is not present", () => {
      expect(parserUtil.findResolver("unknown")).toBe(EmptyResolver);
    });
  });

  describe("Initialize", () => {
    test("it initializes the root resolver with empty $init", () => {
      const parser = new Parser({ chance: ChanceResolver });
      parser.initialize({});

      expect(parser.resolver).toBeDefined();
      expect(parser.resolver.supportedTypes.length).toBeGreaterThan(0);
    });

    test("it initializes the root resolver when unknown resolver names present in $init", () => {
      const parser = new Parser({ chance: ChanceResolver });
      parser.initialize({ whatever: { seed: 10 } });

      expect(parser.resolver).toBeDefined();
      expect(parser.resolver.supportedTypes.length).toBeGreaterThan(0);
    });

    test("it initializes the root resolver when correct resolver names present in $init", () => {
      const parser = new Parser({ chance: ChanceResolver });
      parser.initialize({ chance: { seed: 11 } });

      expect(parser.resolver).toBeDefined();
      expect(parser.resolver.supportedTypes.length).toBeGreaterThan(0);
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
      parser.initialize({ seed: 20 });
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

    test("it calls resolve directly if the object has $type set", () => {
      parser.parseObject({ $type: "name", a: "a", b: "number" });

      expect(parser.parseSwitch).not.toBeCalled();
      expect(parser.resolver.resolve).toBeCalledWith("name", {
        a: "a",
        b: "number"
      });
      expect(parser.parseObject).toReturnWith("John Doe");
    });

    test("it also sends other items as args in the object with $type defined", () => {
      parser.parseObject({ $type: "add", a: 5, b: 7 });

      expect(parser.parseSwitch).not.toBeCalled();
      expect(parser.resolver.resolve).toBeCalledWith("add", {
        a: 5,
        b: 7
      });
      expect(parser.parseObject).toReturnWith(12);
    });

    test("it preprocesses args in $process array if present", () => {
      parser.parseObject({
        $type: "add",
        a: 5,
        b: "number",
        $process: ["b", "c"]
      });

      expect(parser.parseSwitch).toBeCalledWith("number");
      expect(parser.parseSwitch).toReturnWith(9);
      expect(parser.resolver.resolve).toBeCalledWith("add", {
        a: 5,
        b: 9
      });
      expect(parser.parseObject).toReturnWith(14);
    });
  });

  describe("Parse", () => {
    let parser: Parser;

    beforeAll(() => {
      parser = new Parser({ chance: ChanceResolver });
      parser.initialize({ seed: 20 });
    });

    afterAll(() => {
      parser = undefined;
    });

    beforeEach(() => {
      jest.spyOn(parser, "parse");
      jest.spyOn(parser, "initialize");
      jest.spyOn(parser, "parseObject");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    test("it returns null if called with no object", () => {
      parser.parse(undefined);
      expect(parser.parse).toReturnWith(null);
    });

    test("it returns empty object if called with empty object", () => {
      parser.parse({});
      expect(parser.parse).toReturnWith({});
    });

    test("it calls initialize function if called with any object", () => {
      parser.parse({});
      expect(parser.initialize).toBeCalled();
    });

    test("it calls parseObject function if called with any object", () => {
      parser.parse({});
      expect(parser.parseObject).toBeCalled();
    });
  });
});
