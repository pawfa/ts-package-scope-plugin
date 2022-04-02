import { PluginCreateInfo, TypeScript} from "../package.tsserver/types";
import {getSourceFile} from "../package.tsserver/utils";
import path from "path";

export function isPublicScoped(info: PluginCreateInfo, fileName:string, importPath:string, ts: TypeScript) {
    const importedFileName = path.isAbsolute(importPath) ? importPath : path.join(path.parse(fileName).dir, importPath);
    const importedSourceFile = getSourceFile(info.languageService, importedFileName + (importedFileName.endsWith(".ts") ? '': ".ts"));
    const commentRange = ts.getLeadingCommentRanges(importedSourceFile?.getFullText(), importedSourceFile?.getFullStart())?.[0];
    return Boolean(commentRange && importedSourceFile?.getFullText().slice(commentRange.pos, commentRange.end).includes("public"))
}