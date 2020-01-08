/*
	Copyright (C) Paul Hocker. All rights reserved.
	Licensed under the MIT License. See License.txt in the project root for license information.
*/

import { spawn } from 'child_process';
import { workspace, window, Disposable, ExtensionContext, commands, Uri } from 'vscode';
import PathUtils from '../utils/PathUtils';
import * as vscode from 'vscode';
import * as path from 'path';


export class CommandDebug {

    private _configuration: vscode.WorkspaceConfiguration;

    constructor(context: ExtensionContext, output: vscode.OutputChannel) {
        this._configuration = workspace.getConfiguration('kickassembler');
    }

    public run(output: vscode.OutputChannel) {

        //  is the emulator path set?
        let debuggerRuntime: string = this._configuration.get("debuggerRuntime");

        let debuggerOptionsString: string = this._configuration.get("debuggerOptions");
        let debuggerOptions = debuggerOptionsString.match(/\S+/g) || [];
        
        //  build source and output dirs
        var outputDirectory: string = this._configuration.get("outputDirectory");
        var sourcePath: string = PathUtils.uriToFileSystemPath(window.activeTextEditor.document.uri.toString());

        if (outputDirectory == "") {
            outputDirectory = sourcePath;
        }

        //  build file path
        //  the below code is dumb, but will work for now
        let prg = path.basename(sourcePath);
        prg = prg.replace(".asm", ".prg");
        prg = prg.replace(".kick", ".prg");
        prg = prg.replace(".a", ".prg");
        prg = prg.replace(".ka", ".prg");

        let vsf = prg.replace(".prg", ".vs");
        
        var newPath = path.join(path.dirname(sourcePath), outputDirectory);
        prg = path.join(newPath, path.basename(prg));
        prg = path.resolve(prg);

        console.log(`- looking for file ${prg}`);

        //  spawn child process for win32
        if (process.platform == "win32") {
            let emu = spawn(debuggerRuntime, ["-breakpoints", "breakpoints.txt", "-vicesymbols", vsf, "-prg", prg, ...debuggerOptions], {
                detached: true,
                stdio: 'inherit',
                shell: false
            });

            console.log(emu);
            emu.unref();
            return;
        }

        //  spawn child process for osx
        if (process.platform == "darwin") {
            let emu = spawn("open", [debuggerRuntime, "--args", "-breakpoints", "breakpoints.txt", "-vicesymbols", vsf, "-prg", prg, ...debuggerOptions], {
                detached: true,
                stdio: 'inherit',
                shell: true
            });

            emu.unref();
            return;
        }

        //  spawn child process for linux
        if (process.platform == "linux") {

            let emu = spawn(debuggerRuntime, ["-breakpoints", "breakpoints.txt", "-vicesymbols", vsf, "-prg", prg, ...debuggerOptions], {
                detached: true,
                stdio: 'inherit',
                shell: false
            });

            emu.unref();
            return;
        }
        //  create new output channel
        window.showErrorMessage(`Platform ${process.platform} is not Supported.`);
    }
}