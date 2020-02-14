/*
	Copyright (C) Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { spawn, spawnSync } from 'child_process';
import { Uri, workspace, window, Disposable, ExtensionContext, commands, WorkspaceConfiguration } from 'vscode';
import PathUtils from '../utils/PathUtils';  
import * as vscode from 'vscode';
import * as path from 'path';
import ClientUtils from '../utils/ClientUtils';
import * as fs from 'fs';


export class CommandBuild { 

    private configuration: WorkspaceConfiguration;
    private output: vscode.OutputChannel;

    constructor(context:ExtensionContext, output:vscode.OutputChannel) {
        this.configuration = workspace.getConfiguration('kickassembler');
        this.output = output;
    }

    public build():number {

        // get the java runtime
        let javaRuntime:string = this.configuration.get("javaRuntime");

        // get the path to the kickass jar
        let assemblerJar:string = this.configuration.get("assemblerJar");

        // get the output filename from the current filename
        let outputFile = ClientUtils.GetWorkspaceProgramFilename();

        // delete old output
        // TODO: remove any program output like symbols
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }

        // create symbol directory
        let symbolDir:string = ClientUtils.GetOutputPath();

        // get the path of the source
        var sourcePath: string = PathUtils.GetPathFromFilename(PathUtils.uriToPlatformPath(window.activeTextEditor.document.uri.toString()));

        // locate file, does it exist?
        let af = window.activeTextEditor;
        let ws = workspace;
        let docs = ws.textDocuments;
        let te = window.visibleTextEditors;
        let doc = window.activeTextEditor.document;
        let openDocument = ClientUtils.GetOpenDocument();

        var file:string;

        if (openDocument) {
            file = openDocument.fsPath;    
        }

        // file = PathUtils.uriToFileSystemPath(doc.uri.toString());

        if (!file) {
            window.showWarningMessage('Unable to Build.');
            return 1;
        }

        let base = path.basename(file).toUpperCase();

        window.showInformationMessage(`Building ${base}`);

        // create new output channel
        this.output.clear();
        this.output.show(true);

        // spawn new child process to compile the program

        var start = process.hrtime();

        let javaOptions = ["-jar", assemblerJar, file, "-o", outputFile, "-symbolfile", "-symbolfiledir", symbolDir];

        // add option to dump debugger info
        if (this.configuration.get("debuggerDumpFile")){
            javaOptions.push('-debugdump');
        }
        if (this.configuration.get("emulatorViceSymbols")){
            javaOptions.push('-vicesymbols');
        }
        // add setting to allow java file creation
        if (this.configuration.get("javaAllowFileCreation")){
            javaOptions.push('-afo');
        }
        if(this.configuration.get("opcodes.DTV")){
            javaOptions.push('-dtv');
        }
        if(!this.configuration.get("opcodes.illegal")){
            javaOptions.push('-excludeillegal');
        }
        
        var libdirPaths:string[] = this.configuration.get("assemblerLibraryPaths");
        libdirPaths.forEach((path) => {
            if (fs.existsSync(path)) {
                javaOptions.push('-libdir',path);
            }
        });

        let java = spawnSync(javaRuntime, javaOptions, { cwd: path.resolve(sourcePath) });

        var end = process.hrtime(start);

        let errorCode = java.status;

        let time = `(${end[0]}s ${end[1].toString().substr(0,3)}ms)`;

        if (errorCode > 0) {
            window.showWarningMessage(`Build of ${base} Failed ${time}`);
            this.output.append(java.stdout.toString());
        } else {
            window.showInformationMessage(`Build of ${base} Complete ${time}`);
            this.output.append(java.stdout.toString());
        }

        return errorCode;
    }

    
}

