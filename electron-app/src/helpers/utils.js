// Might be a better idea to get it from server.
const SEP_REGEX = /\/\\/;
let cachedSeparator;

export function getSep(path) {
  if (cachedSeparator) {
    return cachedSeparator;
  }
  const separator = path.match(SEP_REGEX);
  if (separator) {
    cachedSeparator = separator[0];
  }
  return cachedSeparator || '/';
}

export function baseDir(path, sep) {
  const separator = sep || getSep(path);
  // Wouldn't work very well on windows.
  return (
    path.split(new RegExp(separator, 'g')).slice(0, -1).join(separator) ||
    separator
  );
}

export function filterSuggestions(all, path, sep) {
  const separator = sep || getSep(path);
  const basename = (path.split(separator).pop() || '').toLowerCase();

  if (!basename) {
    return all || [];
  }

  return (all || []).filter((item) =>
    (item.name || '').toLowerCase().startsWith(basename)
  );
}

export function relativePath(absolute, base, sep) {
  const separator = sep || getSep(absolute);
  if ((absolute || '').startsWith(base)) {
    return absolute.replace(base, '').replace(new RegExp(`^${separator}`), '');
  }
  return absolute;
}
