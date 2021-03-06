import { GetCompletionsAtPositionOptions } from "typescript/lib/tsserverlibrary";
import { isFromTheSamePackage } from "../core/isFromTheSamePackage";
import { isPackageScoped } from "../core/isPackageScoped";
import { PluginCreateInfo, TypeScript } from "./types";
import { getSourceFile } from "./utils";
import { Logger } from "./logger";
import { isPublicScoped } from "../core/isPublicScoped";
import { Diagnostic } from "typescript";
import { isIncluded } from "../core/isIncluded";
import path from "path";
import { makePathPosix } from "../utils/path.utils";

export const PACKAGE_SCOPE_ERROR_CODE = 100000;

export function init(modules: { typescript: TypeScript }) {
  const ts = modules.typescript;

  function create(info: PluginCreateInfo) {
    const isIntelliSenseDisabled = info.config.options && info.config.options.intelliSense === false;
    const packageNames = (info.config.options && info.config.options.packageNames) || [];
    const include: string[] | undefined = info.config.options && info.config.options.include;

    const logger = new Logger(info.project.projectService.logger);
    logger.info("Ts-package-scope-plugin is getting set up.");

    return new Proxy(info.languageService, {
      get(target, p) {
        /** Function which returns array of objects described by
         * {@link Diagnostic} interface which represents errors visible in IDE
         **/
        if (p === "getSemanticDiagnostics") {
          return function getSemanticDiagnostics(fileName: string): Diagnostic[] {
            const origin_diagnostics = target.getSemanticDiagnostics(fileName);

            const sourceFile = getSourceFile(info.languageService, fileName);
            const currentDirectory = info.project.getCurrentDirectory();
            const diags: Diagnostic[] = [];

            sourceFile?.forEachChild((node) => {
              if (ts.isImportDeclaration(node)) {
                const importPath = node.moduleSpecifier.getText().replace(/["']/g, "");
                const { fileName } = sourceFile;

                const areBothFilesPackageScoped =
                  isPackageScoped(fileName, packageNames) && isPackageScoped(importPath, packageNames);

                const currentFileDir = path.posix.dirname(makePathPosix(fileName));
                const importPathPosix = makePathPosix(importPath);
                const importPathAbsolute = path.posix.join(currentFileDir, importPathPosix);

                if (
                  areBothFilesPackageScoped &&
                  (include
                    ? isIncluded(fileName, currentDirectory, include) &&
                      isIncluded(importPathAbsolute, currentDirectory, include)
                    : true) &&
                  !isFromTheSamePackage(importPath, fileName, packageNames) &&
                  !isPublicScoped(info, fileName, importPath, ts)
                ) {
                  diags.push({
                    source: "[ts-package-scope-plugin]",
                    category: 1,
                    code: PACKAGE_SCOPE_ERROR_CODE,
                    file: sourceFile,
                    start: node.getStart(),
                    length: node.getEnd() - node.getStart(),
                    messageText: "The scope of this file is limited to its package only.",
                  });
                }
              }
            });

            return [...origin_diagnostics, ...diags];
          };
        }

        /** Function which returns completions suggested by IDE - not working for Intellij **/
        if (!isIntelliSenseDisabled && p === "getCompletionsAtPosition") {
          return function getCompletionsAtPosition(
            fileName: string,
            position: number,
            formatOptions: GetCompletionsAtPositionOptions | undefined
          ) {
            const priorCompletionInfo = info.languageService.getCompletionsAtPosition(
              fileName,
              position,
              formatOptions
            );
            const sourceFile = getSourceFile(info.languageService, fileName);

            if (!priorCompletionInfo || !sourceFile) {
              return priorCompletionInfo;
            }
            priorCompletionInfo.entries = priorCompletionInfo.entries.filter((completionEntry) => {
              if (!completionEntry.data || !completionEntry.data.fileName) {
                return true;
              }
              return isPackageScoped(completionEntry.data.fileName, packageNames) &&
                isPackageScoped(sourceFile.fileName, packageNames)
                ? !isFromTheSamePackage(completionEntry.data.fileName, sourceFile.fileName, packageNames)
                  ? isPublicScoped(info, fileName, completionEntry.data.fileName, ts)
                  : true
                : true;
            });

            return priorCompletionInfo;
          };
        }
        return (target as never)[p];
      },
    });
  }

  return { create };
}
