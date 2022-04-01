const importPackageNameRegex = /[\/\\](package\.)?([\w\d]+)(\.package)?/;

export function isFromTheSamePackage(importedFileName:string, currentFileName: string){
    return importedFileName.match(importPackageNameRegex)?.[2] === currentFileName.match(importPackageNameRegex)?.[2];
}