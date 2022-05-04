import { PluginCreateInfo, TypeScript} from "../package.tsserver/types";
import {getSourceFile} from "../package.tsserver/utils";
import path from "path";
import { JSDocTag } from "typescript/lib/tsserverlibrary";

export function isPublicScoped(info: PluginCreateInfo, fileName:string, importPath:string, ts: TypeScript) {
    const importedFileName = path.isAbsolute(importPath) ? importPath : path.join(path.parse(fileName).dir, importPath);
    const importedSourceFile = getSourceFile(info.languageService, importedFileName + (importedFileName.endsWith(".ts") ? '': ".ts"));

    const importFilePackageJsDocTags: JSDocTag[] = [];

    importedSourceFile?.forEachChild((node) => {
        const packageJsDocTagsForNode = ts.getJSDocTags(node).filter((tag)=> tag.tagName.escapedText.toString().includes("package-"));
        importFilePackageJsDocTags.push(...packageJsDocTagsForNode);
    })

    const isPublicScopeJsDocSet = importFilePackageJsDocTags.find((tag)=> {
        if(tag.tagName.escapedText.toString() === 'package-scope' && typeof tag.comment === 'string') {
            return tag.comment.includes("public")
        }
    });

    return Boolean(isPublicScopeJsDocSet)
}
