import { Settings } from "../providers/SettingsProvider";
import { AssemblerInfo } from "./AssemblerInfo";
import { TextDocumentItem } from "vscode-languageserver";
import PathUtils from "../utils/PathUtils";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { spawnSync } from "child_process";
import * as path from 'path';


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

    public assemble(settings: Settings, uri:string, text: string): AssemblerResults | undefined {

        var outputDirectory: string = settings.outputDirectory;
        var sourcePath: string = PathUtils.getPathFromFilename(PathUtils.uriToPlatformPath(uri));

        if (outputDirectory == "") {
            outputDirectory = sourcePath;
        }

        outputDirectory = path.resolve(outputDirectory);

        var fs = require('fs');
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory);
        }

        //  copy file contents into ".source.txt"
        // var basePath = path.join(outputDirectory, "");
        var filename = path.join(outputDirectory, ".source.txt");
        filename = path.resolve(filename);
        writeFileSync(filename, text);

        //  setup the asminfo.txt output
        var asminfo = path.join(outputDirectory, ".asminfo.txt");
        asminfo = path.resolve(asminfo);

        //  assemble by running java process
        let java = spawnSync(settings.javaRuntime, [
            "-jar",
            settings.assemblerJar,
            filename,
            '-noeval',
            '-warningsoff',
            '-asminfo',
            'allSourceSpecific',
            '-asminfofile',
            asminfo], { cwd: path.resolve(sourcePath) });

        //  get contents of asminfo
        var asminfo_data = readFileSync(asminfo, 'utf8');

        //  prepare assembler results
        var assemblerResults = <AssemblerResults>{};
        assemblerResults.assemblerInfo = new AssemblerInfo(asminfo_data);
        assemblerResults.stdout = java.stdout.toString();
        assemblerResults.stderr = java.stderr.toString();
        assemblerResults.status = java.status;

        //  remove the assembler info file
        // var unlinkResult = unlinkSync(asminfo);

        return assemblerResults;
    }

}