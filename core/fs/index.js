const { join, resolve } = require("path");
const { readdir, lstat } = (() => {
  try {
    return require("fs/promises");
  } catch (e) {
    return require("fs").promises;
  }
})();
const cache = require("./mem-cache");
const { dirEntryMapper, INVALID_PATH } = require("./helper");

async function getContents(path, ignoreCache = false) {
  if (!path || typeof path !== "string" || path.startsWith(".")) {
    throw INVALID_PATH;
  }

  path = resolve(path);

  if (!ignoreCache) {
    const fromCache = cache.get(path);
    if (fromCache) {
      return fromCache.contents;
    }
  }

  const contents = (await readdir(path, { withFileTypes: true }))
    .map(dirEntryMapper)
    .map((entry) => ({
      ...entry,
      fullPath: join(path, entry.name),
    }));
  cache.put(path, contents);
  return contents;
}

module.exports = {
  getContents,
};
