/*
	Copyright (C) Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { spawn, spawnSync } from 'child_process';
import { workspace, window, Disposable, ExtensionContext, commands, WorkspaceConfiguration } from 'vscode';
import PathUtils from '../utils/PathUtils';  
import * as vscode from 'vscode';

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

        //  locate file, does it exist?
        let doc = window.activeTextEditor.document;
        let file = PathUtils.uriToFileSystemPath(doc.uri.toString());
        console.log(`- looking for file ${file}`);

        //  create new output channel
        //let outputChannel = window.createOutputChannel('Kick Assembler Build');
        output.clear();
        output.show();

        //  spawn new child process
        let java = spawnSync(javaRuntime, ["-jar", assemblerJar, file]);

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

