const { Dirent } = require('fs');
const path = require('path');

const DEV_TYPES = {
  BLOCK_DEV: 'BLOCK_DEV',
  CHAR_DEV: 'CHAR_DEV',
  FIFO: 'FIFO',
  SOCKET: 'SOCKET',
  DIR: 'DIR',
  FILE: 'FILE',
  SIM_LINK: 'SIM_LINK',
  UNKNOWN: 'UNKNOWN',
};

const DIR_ENTRY_FN_ENUM_MAP = {
  isDirectory: DEV_TYPES.DIR,
  isFile: DEV_TYPES.FILE,
  isSymbolicLink: DEV_TYPES.SIM_LINK,
  isBlockDevice: DEV_TYPES.BLOCK_DEV,
  isCharacterDevice: DEV_TYPES.CHAR_DEV,
  isFIFO: DEV_TYPES.FIFO,
  isSocket: DEV_TYPES.SOCKET,
  toString: DEV_TYPES.UNKNOWN,
};

const COMMON_LOCS = [
  'DOCUMENTS',
  'DOWNLOADS',
  'DESKTOP',
  'MUSIC',
  'PICTURES',
  'PHOTOS',
  'PUBLIC',
  'VIDEOS',
];

const INVALID_PATH = new Error('Invalid path');
INVALID_PATH.code = 'INVALID_PATH';

/**
 *
 * @param {fs.Dirent} entry
 */
function dirEntry2Type(entry) {
  return Object.entries(DIR_ENTRY_FN_ENUM_MAP).find(([fn]) =>
    Reflect.apply(Dirent.prototype[fn], entry, [])
  )[1];
}

function dirEntryMapper(entry) {
  return {
    name: entry.name,
    type: dirEntry2Type(entry),
  };
}

function commonLocMapper(baseDir) {
  return (all, thisItem) => {
    const name = (thisItem.name || '').toUpperCase();

    // TODO: If symbolic link, resolve and check.
    if (!thisItem.isDirectory() || !COMMON_LOCS.includes(name)) {
      return all;
    }

    return {
      ...all,
      [name]: {
        name: thisItem.name,
        fullPath: `${baseDir}${path.sep}${thisItem.name}`,
      },
    };
  };
}

module.exports = {
  INVALID_PATH,
  dirEntry2Type,
  dirEntryMapper,
  commonLocMapper,
};
