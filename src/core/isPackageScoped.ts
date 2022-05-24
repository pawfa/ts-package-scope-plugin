import path from "path";
import { makePathPosix } from "../utils/path.utils";
import { hasPackageInName } from "./hasPackageInName";

export function isPackageScoped(fileName: string, packageNames?: string[]) {
  const fileNameSplitted = makePathPosix(path.normalize(fileName)).split(path.posix.sep);

  return (
    fileNameSplitted.some((name) => hasPackageInName(name)) ||
    packageNames?.some((packageName) => fileNameSplitted.includes(packageName))
  );
}
