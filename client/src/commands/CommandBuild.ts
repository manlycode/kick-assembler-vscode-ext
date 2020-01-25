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

    private _configuration: WorkspaceConfiguration;

    constructor(context:ExtensionContext, output:vscode.OutputChannel) {
        this._configuration = workspace.getConfiguration('kickassembler');
    }

    public build(output:vscode.OutputChannel):number {

        // get the java runtime
        let javaRuntime:string = this._configuration.get("javaRuntime");

        // get the path to the kickass jar
        let assemblerJar:string = this._configuration.get("assemblerJar");

        // get the output filename
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
        let doc = window.activeTextEditor.document;
        let file = PathUtils.uriToFileSystemPath(doc.uri.toString());

        // create new output channel
        output.clear();
        output.show(true);

        // spawn new child process to compile the program

        let javaOptions = ["-jar", assemblerJar, file, "-o", outputFile, "-symbolfile", "-symbolfiledir", symbolDir];

        // add option to dump debugger info
        if (this._configuration.get("debuggerDumpFile")){
            javaOptions.push('-debugdump');
        }

        // add setting to allow java file creation
        if (this._configuration.get("javaAllowFileCreation")){
            javaOptions.push('-afo');
        }

        let java = spawnSync(javaRuntime, javaOptions, { cwd: path.resolve(sourcePath) });
        let errorCode = java.status;

        if (errorCode > 0) {
            window.showWarningMessage('Compile Failed with Errors.');
            output.append(java.stdout.toString());
        } else {
            output.append(java.stdout.toString());
        }

        return errorCode;
    }

    
}

