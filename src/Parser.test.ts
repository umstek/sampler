import Parser, * as parserUtil from "./Parser";
import Resolver from "./Resolver";
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
    // if we don't provide the resolver here, it will use the unmocked one.
    const parser = new Parser({ chance: ChanceResolver });

    test("it initializes the root resolver", () => {
      parser.initialize({});

      expect(parser.resolver).toBeDefined();
    });
  });

  describe("ParseSwitch", () => {
    const parser = new Parser({ chance: ChanceResolver });
    parser.initialize({});

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
});
