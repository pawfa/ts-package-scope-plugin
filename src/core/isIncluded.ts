import { concatPathsWithPosixSeparator, makePathPosix, removeLeadingSlash } from "../utils/path.utils";
import { isMatch } from "micromatch";

export function isIncluded(fileName: string, currentDir: string, include: string[]) {
  return include.some((pattern) => {
    const normalizedCurrentFileName = makePathPosix(fileName);
    const normalizedPattern = removeLeadingSlash(makePathPosix(pattern));
    const currentDirectoryNormalized = makePathPosix(currentDir);

    const absolutePattern = concatPathsWithPosixSeparator(currentDirectoryNormalized, normalizedPattern);

    return isMatch(normalizedCurrentFileName, absolutePattern);
  });
}
