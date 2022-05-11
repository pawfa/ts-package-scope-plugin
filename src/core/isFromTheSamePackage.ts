import path from "path";
import { makePathPosix } from "../utils/path.utils";

export function isFromTheSamePackage(importedFileName: string, currentFileName: string, packageNames: string[]) {
  const importFileNameSplitted = makePathPosix(path.normalize(importedFileName)).split(path.posix.sep);
  const currentFileNameSplitted = makePathPosix(path.normalize(currentFileName)).split(path.posix.sep);

  const importedPackageName = importFileNameSplitted
    .find((el) => el.includes("package") || packageNames.includes(el))
    ?.replace(/package|\./g, "");

  const currentPackageName = currentFileNameSplitted
    .find((el) => el.includes("package") || packageNames.includes(el))
    ?.replace(/package|\./g, "");

  return importedPackageName && currentPackageName && importedPackageName === currentPackageName;
}
