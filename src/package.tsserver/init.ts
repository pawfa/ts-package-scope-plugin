import { GetCompletionsAtPositionOptions } from "typescript/lib/tsserverlibrary";
import { isFromTheSamePackage } from "../package.core/isFromTheSamePackage";
import { isPackageScoped } from "../package.core/isPackageScoped";
import { PluginCreateInfo, TypeScript } from "./types";
import { getSourceFile } from "./utils";
import { Logger } from "./logger";
import { isPublicScoped } from "../package.core/isPublicScoped";
import { Diagnostic } from "typescript";

export function init(modules: { typescript: TypeScript }) {
  const ts = modules.typescript;

  function create(info: PluginCreateInfo) {
    const isIntelliSenseDisabled = info.config.options && info.config.options.intelliSense === false;

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

            const diags: Diagnostic[] = [];

            sourceFile?.forEachChild((node) => {
              if (ts.isImportDeclaration(node)) {
                const importPath = node.moduleSpecifier.getText().replace(/["']/g, "");
                const { fileName } = sourceFile;

                if (
                  isPackageScoped(fileName) &&
                  isPackageScoped(importPath) &&
                  !isFromTheSamePackage(importPath, fileName) &&
                  !isPublicScoped(info, fileName, importPath, ts)
                ) {
                  diags.push({
                    category: 1,
                    code: 1,
                    file: sourceFile,
                    start: node.getStart(),
                    length: node.getEnd() - node.getStart(),
                    messageText: "Package scope is incorrect.",
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
              return isPackageScoped(completionEntry.data.fileName) && isPackageScoped(sourceFile.fileName)
                ? !isFromTheSamePackage(completionEntry.data.fileName, sourceFile.fileName)
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
