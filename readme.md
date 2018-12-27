# SamplerJS

Generate elaborate random data instantly.  
[![Build Status](https://travis-ci.org/umstek/sampler.svg?branch=master)](https://travis-ci.org/umstek/sampler)
[![codecov](https://codecov.io/gh/umstek/sampler/branch/master/graph/badge.svg)](https://codecov.io/gh/umstek/sampler)

## How to use

### Try it online

View [demo](https://runkit.com/umstek/samplerjs-demo) or POST a JSON in correct format to https://samplerjs-demo-rqwiegzvqqfn.runkit.sh to get random data. (This is achieved with the help of RunKit and is rate-limited.)

### Install

Run:  
`npm install samplerjs`  
or,  
`yarn add samplerjs`  
if you're using yarn.

**Use it on your project:**

```js
const samplerjs = require("samplerjs");
const parser = samplerjs.Parser.chanceParser;
const result = parser.parse({
  user: {
    firstName: {
      $type: "first",
      nationality: "us"
    },
    lastName: "last",
    tel: "phone"
  },
  description: "paragraph"
});
```

## Currently supported data types

Everything supported by the excellent `chance`js library except,

- Helper functions
- `hidden`
- `dice`
- `n`
- `unique`
- `weighted`

These are to-be implemented in a "sampler-native" way in the future.

## Object Format

```js
const fillThisObject = {
  someKey: "typeThatDoesNotNeedArgs",
  otherKey: {
    $type: "typeThatNeedsArgs",
    arg1: "someSimpleArg",
    arg2: {
      // Argument that needs pre-processing
      $type: "type",
      arg1: "arg"
    },
    $process: ["arg2"] // Ask to preprocess arg2 as if it was anothe node in this object tree
  }
};
```
