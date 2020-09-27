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
  return cachedSeparator || "/";
}

export function baseDir(path) {
  const separator = getSep(path);
  // Wouldn't work very well on windows.
  return (
    path.split(new RegExp(separator, "g")).slice(0, -1).join(separator) ||
    separator
  );
}

export function relativePath(absolute, base) {
  if ((absolute || "").startsWith(base)) {
    return absolute.replace(base, "").replace(/^\//, "");
  }
}
