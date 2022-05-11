import path from "path";

export function makePathPosix(str: string) {
  return path.normalize(str).split(path.win32.sep).join(path.posix.sep);
}

export function removeLeadingSlash(str: string) {
  return str.replace(/^[\\/]/, "");
}

export function concatPathsWithPosixSeparator(...str: string[]) {
  return path.posix.join(...str);
}
