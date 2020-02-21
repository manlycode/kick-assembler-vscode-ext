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
import { PassThrough } from 'stream';


export class CommandBuild { 

    private configuration: WorkspaceConfiguration;
    private output: vscode.OutputChannel;

    constructor(context:ExtensionContext, output:vscode.OutputChannel) {
        this.configuration = workspace.getConfiguration('kickassembler');
        this.output = output;
    }

    public buildOpen():number {

        var uri = ClientUtils.GetOpenDocumentUri();
        
        if (!uri) {
            var nostartup = window.showWarningMessage(`No open document to build.`);
            return;
        }

        return this.build(ClientUtils.GetOpenDocumentUri());
    }

    public buildStartup():number {

        var uri = ClientUtils.GetStartupUri();
        
        if (!uri) {

            var nostartup = window.showWarningMessage(`No startup file was defined in your Settings.`, { title: 'Open Settings'});

            nostartup.then((value) => {
                if (value){
                    vscode.commands.executeCommand('workbench.action.openSettings', `kickassembler.startup`);
                }
            });

            return;
        }

        return this.build(ClientUtils.GetStartupUri());
    }

    private build(sourceFile:Uri):number {

        // get the java runtime
        let javaRuntime:string = this.configuration.get("javaRuntime");

        // get the path to the kickass jar
        let assemblerJar:string = this.configuration.get("assemblerJar");

        let base = path.basename(sourceFile.fsPath);

        // get the output filename from the current filename
        let outputFile = path.join(ClientUtils.GetOutputPath(), ClientUtils.CreateProgramFilename(base));

        // delete old output
        // TODO: remove any program output like symbols
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }

        // create symbol directory
        let symbolDir:string = ClientUtils.GetOutputPath();

        // get the path of the source
        var sourcePath: string = PathUtils.GetPathFromFilename(sourceFile.fsPath);

        // create new output channel
        this.output.clear();
        this.output.show(true);

        let javaOptions = [
            "-jar", 
            assemblerJar, 
            sourceFile.fsPath, 
            "-o", 
            outputFile, 
            "-symbolfile", 
            "-symbolfiledir", 
            symbolDir
        ];

        if (this.configuration.get("debuggerDumpFile")){
            javaOptions.push('-debugdump');
        }

        if (this.configuration.get("emulatorViceSymbols")){
            javaOptions.push('-vicesymbols');
        }

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

        window.showInformationMessage(`Building ${base.toUpperCase()}`);

        var start = process.hrtime();

        let java = spawnSync(javaRuntime, javaOptions, { cwd: path.resolve(sourcePath) });

        var end = process.hrtime(start);

        let errorCode = java.status;

        let time = `(${end[0]}s ${end[1].toString().substr(0,3)}ms)`;

        if (errorCode > 0) {
            window.showWarningMessage(`Build of ${base.toUpperCase()} Failed ${time}`);
            this.output.append(java.stdout.toString());
        } else {
            window.showInformationMessage(`Build of ${base.toUpperCase()} Complete ${time}`);
            this.output.append(java.stdout.toString());
        }

        return errorCode;
    }
}

