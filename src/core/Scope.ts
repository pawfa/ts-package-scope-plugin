import { getSourceFile } from "../tsserver/utils";
import { PluginCreateInfo } from "../tsserver/types";
import { isPackageScoped } from "./isPackageScoped";
import { isIncluded } from "./isIncluded";
import { makePathPosix } from "../utils/path.utils";
import path from "path";
import { isFromTheSamePackage } from "./isFromTheSamePackage";

interface PluginOptions {
  intelliSense?: boolean;
  packageNames?: string[];
  include?: string[];
}

export class Scope {
  private readonly currentFilePath;
  private readonly currentFileDir;
  private importedFilePath: string | undefined;
  private readonly info;
  private options?: PluginOptions;

  readonly sourceFile;

  constructor(info: PluginCreateInfo, currentFilePath: string, options?: PluginOptions) {
    this.currentFilePath = makePathPosix(currentFilePath);
    this.currentFileDir = path.posix.dirname(this.currentFilePath);
    this.info = info;
    this.sourceFile = getSourceFile(info.languageService, currentFilePath);
    this.options = options;
  }

  get currentDirectory() {
    return this.info.project.getCurrentDirectory();
  }

  isCurrentFilePackageScoped() {
    return isPackageScoped(this.currentFilePath, this.options?.packageNames);
  }

  isImportedFilePackageScoped() {
    if (!this.importedFilePath) {
      throw Error();
    }
    return isPackageScoped(this.importedFilePath, this.options?.packageNames);
  }

  isCurrentFileIncluded() {
    return this.options?.include ? isIncluded(this.currentFilePath, this.currentDirectory, this.options.include) : true;
  }

  setImportedFile(importFilePath: string) {
    const importPathPosix = makePathPosix(importFilePath);
    this.importedFilePath = path.posix.join(this.currentFileDir, importPathPosix);
  }

  isImportedFileIncluded() {
    if (!this.importedFilePath) {
      throw Error("Imported file path not provided.");
    }

    return this.options?.include
      ? isIncluded(this.importedFilePath, this.currentDirectory, this.options.include)
      : true;
  }

  areFilesFromTheSamePackage() {
    if (!this.importedFilePath) {
      throw Error("Imported file path not provided.");
    }
    return !isFromTheSamePackage(this.importedFilePath, this.currentFilePath, this.options?.packageNames);
  }
}
