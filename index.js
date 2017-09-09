import Chance from 'chance';
const chance = new Chance();

export default async function (hook) {
  hook.res.end(hook.params);
}