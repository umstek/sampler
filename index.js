export default async function (hook) {
  hook.res.end(hook.params);
}
