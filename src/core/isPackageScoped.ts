import path from "path";
import { makePathPosix } from "../utils/path.utils";

export function isPackageScoped(fileName: string, packageNames: string[]) {
  const fileNameSplitted = makePathPosix(path.normalize(fileName)).split(path.posix.sep);

  return (
    fileNameSplitted.some((name) => name.includes("package")) ||
    packageNames.some((packageName) => fileNameSplitted.includes(packageName))
  );
}
