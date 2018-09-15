import { Settings } from "../providers/settingsProvider";
import { AssemblerInfo } from "./AssemblerInfo";
import { TextDocumentItem } from "vscode-languageserver";
import PathUtils from "../utils/pathUtils";
import { writeFileSync, readFileSync } from "fs";
import { spawnSync } from "child_process";

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

        //  copy file contents into ".source.txt"
        var path = PathUtils.getPathFromFilename(PathUtils.uriToPlatformPath(textDocument.uri));
        var filename = path + "\\.source.txt";
        writeFileSync(filename, textDocument.text);

        //  setup the asminfo.txt output
        var asminfo = path + "\\.asminfo.txt";

        //  assemble by running java process
        let java = spawnSync(settings.javaPath, [
            "-jar", 
            settings.assemblerPath, 
            filename, 
            '-noeval', 
            '-warningsoff', 
            '-asminfo', 
            'all', 
            '-asminfofile', 
            asminfo], { cwd: path });

        //  get contents of asminfo 
        var asminfo_data = readFileSync(asminfo, 'utf8');

        //  prepare assembler results
        var assemblerResults = <AssemblerResults>{};
        assemblerResults.assemblerInfo = new AssemblerInfo(asminfo_data);
        assemblerResults.stdout = java.stdout.toString();
        assemblerResults.stderr = java.stderr.toString();
        assemblerResults.status = java.status;

        return assemblerResults;
    }

}