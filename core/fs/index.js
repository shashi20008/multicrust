const { join, resolve, basename, sep } = require("path");
const { homedir, tmpdir, platform } = require("os");
const { readdir, lstat } = (() => {
  try {
    return require("fs/promises");
  } catch (e) {
    return require("fs").promises;
  }
})();
const cache = require("./mem-cache");
const { dirEntryMapper, commonLocMapper, INVALID_PATH } = require("./helper");

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

async function getCommonLocs() {
  const homeDir = homedir();

  const allDirs = await readdir(homeDir, {
    encoding: "utf8",
    withFileTypes: true,
  });

  const commonLocations = (allDirs || []).reduce(commonLocMapper(homeDir), {});
  commonLocations.HOME = {
    name: basename(homeDir),
    fullPath: homeDir,
  };
  commonLocations.TEMP = {
    name: "Temp",
    fullPath: tmpdir(),
  };

  return {
    platform: platform(),
    commonLocations,
    sep,
  };
}

module.exports = {
  getContents,
  getCommonLocs,
};
