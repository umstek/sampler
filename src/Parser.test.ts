import * as parserUtil from "./Parser";
const Parser = parserUtil.Parser;
jest.mock("./Resolver/ChanceResolver");
import ChanceResolver from "./Resolver/ChanceResolver";
import EmptyResolver from "./Resolver/EmptyResolver";

describe("Parser utility functions", () => {
  describe("when unscaping strings", () => {
    it("should not change strings w/o $ prefix", () => {
      expect(parserUtil.unescape("asdf")).toBe("asdf");
    });

    it("should not change strings w/ only one $ prefix", () => {
      expect(parserUtil.unescape("$asdf")).toBe("$asdf");
    });

    it("should unescape $ signs if more than one exists", () => {
      expect(parserUtil.unescape("$$asdf")).toBe("$asdf");
      expect(parserUtil.unescape("$$$asdf")).toBe("$$asdf");
    });
  });

  describe("when asked for resolver by name", () => {
    it("should return the specific resolver for any known string", () => {
      expect(parserUtil.findResolver("chance")).toBe(ChanceResolver);
    });

    it("should return empty resolver for any unknown string", () => {
      expect(parserUtil.findResolver("unknown")).toBe(EmptyResolver);
    });
  });
});

describe("Parser object functions", () => {
  describe("when initialized", () => {
    it("should define the default root resolver for empty $init", () => {
      const parser = new Parser({ chance: ChanceResolver });
      parser.initialize({});

      expect(parser.resolver).toBeDefined();
      expect(parser.resolver.supportedTypes.length).toBeGreaterThan(0);
    });

    it("should define the root resolver even if unknown resolver names present in $init", () => {
      const parser = new Parser({ chance: ChanceResolver });
      parser.initialize({ whatever: { seed: 10 } });

      expect(parser.resolver).toBeDefined();
      expect(parser.resolver.supportedTypes.length).toBeGreaterThan(0);
    });

    it("should define the root resolver when correct resolver names present in $init", () => {
      const parser = new Parser({ chance: ChanceResolver });
      parser.initialize({ chance: { seed: 11 } });

      expect(parser.resolver).toBeDefined();
      expect(parser.resolver.supportedTypes.length).toBeGreaterThan(0);
    });
  });

  describe("when any type of object is given", () => {
    let parser: parserUtil.Parser;

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

    it("should call resolve of resolver if the argument is a string", () => {
      parser.parseSwitch("name");

      expect(parser.parseSwitch).toBeCalled();
      expect(parser.parseArray).not.toBeCalled();
      expect(parser.parseObject).not.toBeCalled();
      expect(parser.resolver.resolve).toBeCalledWith("name");
    });

    it("should call parseArray if argument is an array", () => {
      parser.parseSwitch([]);

      expect(parser.parseSwitch).toBeCalled();
      expect(parser.resolver.resolve).not.toBeCalled();
      expect(parser.parseObject).not.toBeCalled();
      expect(parser.parseArray).toBeCalledWith([]);
    });

    it("should call parseObject if argument is an object", () => {
      parser.parseSwitch({});

      expect(parser.parseSwitch).toBeCalled();
      expect(parser.resolver.resolve).not.toBeCalled();
      expect(parser.parseArray).not.toBeCalled();
      expect(parser.parseObject).toBeCalledWith({});
    });

    it("should return the object itself, otherwise", () => {
      const func = () => null; // Whatever func at my disposal
      parser.parseSwitch(func);

      expect(parser.resolver.resolve).not.toBeCalled();
      expect(parser.parseArray).not.toBeCalled();
      expect(parser.parseObject).not.toBeCalled();
      expect(parser.parseSwitch).toReturnWith(func);
    });
  });

  describe("when an array is needed to be parsed", () => {
    let parser: parserUtil.Parser;

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

    it("should call parseSwitch for each array item", () => {
      parser.parseArray([{}, 1, "string"]);

      expect(parser.parseSwitch).toBeCalledTimes(3);
    });
  });

  describe("when an object is needed to be parsed", () => {
    let parser: parserUtil.Parser;

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

    it("should not call parseSwitch for an empty object", () => {
      parser.parseObject({});

      expect(parser.parseSwitch).not.toBeCalled();
      expect(parser.parseObject).toReturnWith({});
    });

    it("should call parseSwitch for an object with keys", () => {
      parser.parseObject({ a: "seed", b: "name" });

      expect(parser.parseSwitch).toBeCalledTimes(2);
      expect(parser.resolver.resolve).toBeCalledWith("seed");
      expect(parser.resolver.resolve).toBeCalledWith("name");
      expect(parser.parseObject).toReturn();
    });

    it("should call resolve directly if the object has $type set", () => {
      parser.parseObject({ $type: "name", a: "a", b: "number" });

      expect(parser.parseSwitch).not.toBeCalled();
      expect(parser.resolver.resolve).toBeCalledWith("name", {
        a: "a",
        b: "number"
      });
      expect(parser.parseObject).toReturnWith("John Doe");
    });

    it("should also send other items as args in the object with $type defined", () => {
      parser.parseObject({ $type: "add", a: 5, b: 7 });

      expect(parser.parseSwitch).not.toBeCalled();
      expect(parser.resolver.resolve).toBeCalledWith("add", {
        a: 5,
        b: 7
      });
      expect(parser.parseObject).toReturnWith(12);
    });

    it("should pre-process args in $process array if present", () => {
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

  describe("when a document is given for parsing", () => {
    let parser: parserUtil.Parser;

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

    it("should return null if called with no object", () => {
      parser.parse(undefined);
      expect(parser.parse).toReturnWith(null);
    });

    it("should return empty object if called with empty object", () => {
      parser.parse({});
      expect(parser.parse).toReturnWith({});
    });

    it("should call initialize function if called with any object", () => {
      parser.parse({});
      expect(parser.initialize).toBeCalled();
    });

    it("should call parseObject function if called with any object", () => {
      parser.parse({});
      expect(parser.parseObject).toBeCalled();
    });
  });
});
