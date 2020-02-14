import { Settings } from "../providers/SettingsProvider";
import { AssemblerInfo } from "./AssemblerInfo";
import { TextDocumentItem } from "vscode-languageserver";
import PathUtils from "../utils/PathUtils";
import { writeFileSync, readFileSync, unlinkSync } from "fs";
import { spawnSync } from "child_process";
import * as path from 'path';
import Uri from "vscode-uri";


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

    public assemble(settings: Settings, filename:string, text: string, ignoreOutputPathSetting: boolean = false, ignoreBuildStartup: boolean = false): AssemblerResults | undefined {

        let buildStartup: string = "";


        if (!ignoreBuildStartup)
            buildStartup = settings.startup;

        let uri:Uri = Uri.parse(filename);

        var outputDirectory: string = settings.outputDirectory;
        var sourcePath: string = PathUtils.getPathFromFilename(PathUtils.uriToPlatformPath(uri.fsPath));

        
        if (outputDirectory == "" || ignoreOutputPathSetting) {
            outputDirectory = sourcePath;
        }

        outputDirectory = path.resolve(outputDirectory);

        var fs = require('fs');
        if (!fs.existsSync(outputDirectory)) {
            fs.mkdirSync(outputDirectory);
        }

        let javaOptions:string [] = [];

        javaOptions.push(
            "-jar",
            settings.assemblerJar
        );

        /*
            when assembling we want to take the
            source code that has been given to us
            and store it in a temporary source file
            first and then tell kickass to 
            use this

            the compile line ends up looking like:

                java -jar {.source.txt}
        */

        var tmpSource = path.join(outputDirectory, ".source.txt");
        tmpSource = path.resolve(tmpSource);

        writeFileSync(tmpSource, text);

        let srcFilename = tmpSource;

        /*
            when masterBuild has been specified we want to
            use that file to assemble, but also make sure that
            the open file (sent to us) is replaced in the compile
            correctly

            the compile ends up looking like:

                java -jar {masterBuild} -replace {uri} {.source.txt}
        */

        let masterOptions:string [] = [];
        
        if (buildStartup) {
            let masterFilename = sourcePath + path.sep + buildStartup;
            srcFilename = masterFilename;
            // sourceText = readFileSync(masterFilename, 'utf8');
            masterOptions.push('-replaceFile', uri.fsPath, tmpSource);
        } else {
            srcFilename = uri.fsPath;
            masterOptions.push('-replaceFile', uri.fsPath, tmpSource);
        }

        javaOptions.push(
            srcFilename,
            '-noeval',
            '-warningsoff',
        );

        javaOptions = javaOptions.concat(masterOptions);

        /*
            the asminfo file is very important because
            it returns information about any errors
            in the source and also the list of symbols
            that are in the assembled source codes
        */

        var tmpAsmInfo = path.join(outputDirectory, ".asminfo.txt");
        tmpAsmInfo = path.resolve(tmpAsmInfo);

        javaOptions.push(
            '-asminfo',
            'allSourceSpecific|version',
            '-asminfofile',
            tmpAsmInfo
        );

        if(settings.opcodes.DTV){
            javaOptions.push('-dtv');
        }
        if(!settings.opcodes.illegal){
            javaOptions.push('-excludeillegal');
        }

        settings.assemblerLibraryPaths.forEach((path) => {
            if (fs.existsSync(path)) {
                javaOptions.push('-libdir',path);
            }
        }); 

        //  run java process and wait for return
        let java = spawnSync(settings.javaRuntime, javaOptions, { cwd: path.resolve(sourcePath) });

        //  get contents of asminfo
        var asminfo_data = readFileSync(tmpAsmInfo, 'utf8');

        //  prepare assembler results
        var assemblerResults = <AssemblerResults>{};
        assemblerResults.assemblerInfo = new AssemblerInfo(asminfo_data, uri.fsPath);
        assemblerResults.stdout = java.stdout.toString();
        assemblerResults.stderr = java.stderr.toString();
        assemblerResults.status = java.status;

        //  remove work files if requested
        if (!settings.keepWorkFiles) {
            unlinkSync(tmpAsmInfo);
            unlinkSync(tmpSource)
        }

        return assemblerResults;
    }

}