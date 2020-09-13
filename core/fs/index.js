const { homedir } = require('os');
const { resolve } = require('path');
const {
  readdir,
  lstat
} = require('fs/promises');
const cache = require('./mem-cache');
const {
  dirEntryMapper,
  INVALID_PATH
} = require('./helper');

async function getContents(path = homedir(), ignoreCache = false) {
  if(!path || typeof path !== 'string' || path.startsWith('.')) {
    throw INVALID_PATH;
  }

  path = resolve(path);

  if(!ignoreCache) {
    const fromCache = cache.get(path);
    if(fromCache) {
      return fromCache.contents;
    }
  }
  
  const contents = (await readdir(path, { withFileTypes: true }))
    .map(dirEntryMapper);
  cache.put(path, contents);
  return contents;
}

module.exports = {
  getContents
};
