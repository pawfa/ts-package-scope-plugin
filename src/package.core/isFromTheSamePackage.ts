import path from "path";

export function isFromTheSamePackage(importedFileName:string, currentFileName: string){
    return importedFileName.split(path.delimiter).find((el)=> el.includes('package'))?.replace(/package|\./g,'') === currentFileName.split(path.delimiter).find((el)=> el.includes('package'))?.replace(/package|\./g,'');
}