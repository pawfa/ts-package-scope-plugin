import { LanguageService } from "./types";

export function getSourceFile(languageService: LanguageService, fileName:string){
    const program = languageService.getProgram()!;
    return program.getSourceFile(fileName)!;
}