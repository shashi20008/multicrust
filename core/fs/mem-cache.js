const fs = require("fs");
const fastCache = {};

/**
 *
 * @param {String} path Path to cache contents for
 * @param {Array} contents
 */
function put(path, contents = []) {
  if (!path) {
    throw new Error("path is required");
  }
  const existing = !!fastCache[path];

  fastCache[path] = {
    contents: contents.slice(0),
    cacheTime: Date.now(),
  };

  if (!existing) {
    startWatching(path);
  }
}

function invalidate(path) {
  const old = fastCache[path];
  fastCache[path] = undefined;
  old && old.onInvalidate && old.onInvalidate();
}

function get(path) {
  return fastCache[path];
}

// What if watch function is not available??
function startWatching(path) {
  const watcher = fs.watch(path, { persistent: false }, () => invalidate(path));
  fastCache[path].onInvalidate = () => watcher.close();
}

// @todo: Would make sense to make this user configurable.
const TEN_MINUTES = 10 * 60 * 1000;
(function cleanup() {
  const tenMinAgo = Date.now() - TEN_MINUTES;

  Object.entries(([path, { cacheTime }]) => {
    if (cacheTime < tenMinAgo) {
      invalidate(path);
    }
  });

  setTimeout(cleanup, TEN_MINUTES);
})();

module.exports = {
  get,
  put,
  invalidate,
};
