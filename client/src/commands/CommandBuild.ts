/*
	Copyright (C) Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { spawn, spawnSync } from 'child_process';
import { workspace, window, Disposable, ExtensionContext, commands, WorkspaceConfiguration } from 'vscode';
import PathUtils from '../utils/PathUtils';  
import * as vscode from 'vscode';
import * as path from 'path';


export class CommandBuild { 

    private _configuration: WorkspaceConfiguration;

    constructor(context:ExtensionContext, output:vscode.OutputChannel) {
        this._configuration = workspace.getConfiguration('kickassembler');
    }

    public build(output:vscode.OutputChannel):number {

        //  is the java path set?
        let javaRuntime:string = this._configuration.get("javaRuntime");

        //  is the kickass path set?
        let assemblerJar:string = this._configuration.get("assemblerJar");

        //  create output name
        var outputDirectory: string = this._configuration.get("outputDirectory");
        var sourceFile: string = PathUtils.uriToFileSystemPath(window.activeTextEditor.document.uri.toString());
        let prg = path.basename(sourceFile);
        prg = prg.replace(".asm", ".prg");
        prg = prg.replace(".kick", ".prg");
        prg = prg.replace(".a", ".prg");
        prg = prg.replace(".ka", ".prg");
        let outputFile = outputDirectory +  "\\" + prg;

        //  create symbol directory
        let symbolDir = outputDirectory;

        //  get the path of the source
        var sourcePath: string = PathUtils.getPathFromFilename(PathUtils.uriToPlatformPath(window.activeTextEditor.document.uri.toString()));

        //  locate file, does it exist?
        let doc = window.activeTextEditor.document;
        let file = PathUtils.uriToFileSystemPath(doc.uri.toString());

        //  create new output channel
        output.clear();
        output.show(true);

        //  spawn new child process
        let javaOptions = ["-jar", assemblerJar, file, "-o", outputFile, "-symbolfile", "-symbolfiledir", symbolDir];
        if (this._configuration.get("debuggerDumpFile")){
            javaOptions.push('-debugdump');
        }
        let java = spawnSync(javaRuntime, javaOptions, { cwd: path.resolve(sourcePath) });
        let errorCode = java.status;

        if (errorCode > 0) {
            window.showErrorMessage('Compilation failed with errors.');
            output.append(java.stdout.toString());
        } else {
            output.append(java.stdout.toString());
        }

        return errorCode;
    }

    
}

