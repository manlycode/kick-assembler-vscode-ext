import { Settings } from "../providers/settingsProvider";
import { AssemblerInfo } from "./assemblerInfo";
import { TextDocumentItem } from "vscode-languageserver";

/*
    Class: Assembler

        Runs the Kick Assembler to Assemble a Source File


    Remarks:

        Attempts to run the Kick Assembler, but will not actually
        create the assembled object. Instead it will produce
        an assembly information file, that can be used for
        diagnostic information about the source file being
        worked on.

*/

export interface AssemblerResults {
    assemblerInfo: AssemblerInfo;
    stdout: string;
    stderr: string;
    status: number;
}


export class Assembler {

    private assemblerResults: AssemblerResults;

    constructor() {
    }

    public assemble(settings: Settings, textDocument: TextDocumentItem): AssemblerResults | undefined {

        //  assemble the file


        //  check for asminfo.txt

        //  get assembler results

        var assemblerResults = <AssemblerResults>{};
        assemblerResults.assemblerInfo = new AssemblerInfo(textDocument.uri);
        return undefined;
    }

}