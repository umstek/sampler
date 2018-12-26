import IResolver from "./IResolver";
import { Chance } from "chance";

const easy = [
  "bool",
  "character",
  "floating",
  "integer",
  "letter",
  "natural",
  "string",
  "paragraph",
  "sentence",
  "syllable",
  "word",
  "age",
  "birthday",
  "cf",
  "cpf",
  "first",
  "gender",
  "last",
  "name",
  "prefix",
  "ssn",
  "suffix",
  "android_id",
  "apple_token",
  "bb_pin",
  "wp7_anid",
  "wp8_anid2",
  "avatar",
  "color",
  "company",
  "domain",
  "email",
  "fbid",
  "google_analytics",
  "hashtag",
  "ip",
  "ipv6",
  "klout",
  "profession",
  "tld",
  "twitter",
  "url",
  "address",
  "altitude",
  "areacode",
  "city",
  "coordinates",
  "country",
  "depth",
  "geohash",
  "latitude",
  "longitude",
  "phone",
  "postal",
  "province",
  "state",
  "street",
  "zip",
  "ampm",
  "date",
  "hammertime",
  "hour",
  "millisecond",
  "minute",
  "month",
  "second",
  "timestamp",
  "timezone",
  "weekday",
  "year",
  "cc",
  "cc_type",
  "currency",
  "currency_pair",
  "dollar",
  "euro",
  "exp",
  "exp_month",
  "exp_year",
  "coin",
  "guid",
  "hash",
  "normal",
  "radio",
  "tv"
];

const spreadable = {
  capitalize: ["string"],
  pad: ["number", "width", "padder"]
};

export default class ChanceResolver implements IResolver {
  supportedTypes: string[];

  constructor(args?: { seed: Chance.Seed }) {
    if (args && args.seed) {
      this.chance = new Chance(args.seed);
    } else {
      this.chance = new Chance();
    }

    this.supportedTypes = [...Object.keys(spreadable), ...easy, "rpg"];
  }

  chance: Chance.Chance;

  resolve(type: string, args?: { [x: string]: any }) {
    if (easy.indexOf(type) !== -1) {
      // Optional arguments
      return this.chance[type](args);
    } else if (type in spreadable) {
      const filteredArgs = [];

      // Find arguments, in the correct order, and skip unnecessary args
      for (let i = 0; i < spreadable[type].length; i += 1) {
        const param = spreadable[type][i];

        // Break when one required arg is not found
        if (!args[param]) {
          break;
        }
        filteredArgs.push(args[param]);
      }

      return this.chance[type](...filteredArgs);
    }

    switch (type) {
      case "rpg":
        if (args.sum) {
          return this.chance.rpg(args.dice, { sum: args.sum });
        }
        return this.chance.rpg(args.dice);
      default:
        // All supported types are implemented; this will not be hit
        return null;
    }
  }
}
